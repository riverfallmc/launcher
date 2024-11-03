#![allow(unused)]
/**
 * Это будет единственный, хоть как-то документированный модуль
 * И только потому-что тут просто полный пиздец по логике, и запутаться как нехуй делать, лол))
 */

use std::{borrow::BorrowMut, fs::{self, File}, io::Write, path::Path, sync::Arc, time::{Duration, Instant}};
use create::CreateData;
use hashbrown::HashMap;
use lazy_static::lazy_static;
use reqwest::Response;
use serde::{Deserialize, Serialize};
use tokio::{runtime::Runtime, sync::Mutex, task::{self, JoinHandle}};
use tauri::{async_runtime::TokioJoinHandle, Emitter};
use crate::util::{paths::LauncherPaths, tauri::{get_main_window, message}, url::join_url};
use super::unpack::unpack_rar;

pub(crate) mod create;
pub(crate) mod update;
pub(crate) mod delete;

const EMIT_EVENT_ID: &'static str = "downloadThread";
const ARCHIVE_NAME: &'static str = "gameclient.zip";

/// * Можно скрыть
lazy_static! {
  /// Singleton очереди приложения
  static ref DOWNLOAD_QUEUE: Mutex<Queue> = Mutex::new(Queue::new());
}

/// Возвращает глобальную (ну она типо как singleton) очередь приложения
/// в виде мьютекса, так что если надо как-то с ней взаимодействовать
/// то держи пример как это делать:
/// ```rs
/// let queue = &mut *get_download_queue().lock().await;
/// queue.add(String::from("magic-rpg"), String::from("Magic RPG #1"));
/// ```
pub(crate) fn get_download_queue() -> &'static Mutex<Queue> {
  &DOWNLOAD_QUEUE
}

/// DownloadableObject без мьютекса
/// * Можно скрыть
#[derive(Serialize, Deserialize, Debug, Clone)]
struct DownloadableObjectNoMutex {
  id: String,
  name: String,
  speed: f32,
  progress: u8,
  state: u64,
  paused: bool
}

/// Единица скачиваемого клиента
/// * Можно скрыть
#[derive(Debug)]
pub(crate) struct DownloadableObject {
  /// Айди клиента
  // magic-rpg
  id: Mutex<String>,
  /// Название клиента
  // Magic RPG №1
  name: Mutex<String>,
  /// Скорость загрузки
  // 10.4 мбайт/с
  speed: Mutex<f32>,
  /// Процентное отношение загруженного контента
  // 100%
  progress: Mutex<u8>,
  /// Статус загрузки (сколько байт уже скачалось)
  // 0 мб
  state: Mutex<u64>,
  /// Поставлена ли загрузка на паузу?
  // false
  paused: Mutex<bool>
}

/// * Можно скрыть
impl Default for DownloadableObject {
  fn default() -> Self {
    DownloadableObject {
      id: Mutex::new(String::new()),
      name: Mutex::new(String::new()),
      speed: Mutex::new(0.0),
      progress: Mutex::new(0),
      state: Mutex::new(0),
      paused: Mutex::new(false),
    }
  }
}

impl DownloadableObject {
  fn new(
    id: String,
    name: String
  ) -> DownloadableObject {
    DownloadableObject {
      id: Mutex::new(id),
      name: Mutex::new(name),
      paused: Mutex::new(false),
      ..Default::default()
    }
  }

  /// Формирует ссылку для скачивания\
  /// Пример → ``https://localhost/client/magic-rpg``
  async fn get_download_url(&self) -> String {
    join_url(&format!("client/{}.zip", self.id.lock().await))
  }

  /// Считает, сколько уже байтов скачано и возвращает число от 0 до 100 (если body_size >= downloaded)\
  /// То-есть возвращает сколько процентов скачано короч
  fn calc_progress(downloaded: u64, body_size: u64) -> u8 {
    ((downloaded as f32/body_size as f32)*100.0) as u8
  }

  /// Возвращает путь до папки клиента
  async fn get_client_path(&self) -> anyhow::Result<String> {
    let id = self.id.lock().await.to_string();

    Ok(LauncherPaths::get_client_path(id)?)
  }

  /// Возвращает путь до архива с клиентом после загрузки
  async fn get_archive_path(&self) -> anyhow::Result<String> {
    Ok(format!("{}/{ARCHIVE_NAME}", self.get_client_path().await?))
  }

  /// ``INTERNAL``\
  /// Нужно для метода ``save_body``, чтобы открыть файл-архив для загрузки чанков
  async fn open_archive_file(&self) -> anyhow::Result<File> {
    let archive_path = self.get_archive_path().await?;

    if Path::new(&archive_path).exists() {
      fs::remove_file(archive_path.clone());
    }

    Ok(File::create(archive_path)?)
  }

  /// Распаковывает скачанный архив клиента в директорию клиента
  async fn unpack(&self) -> anyhow::Result<()> {
    let archive_path = self.get_archive_path().await?;

    unpack_rar(&archive_path, &self.get_client_path().await?)?;

    fs::remove_file(&archive_path)?;

    log::info!("Game client unpacked. Download completed");

    Ok(())
  }

  /// Скачивает и сохраняет архив клиента с сервера\
  /// Затем распаковывает
  async fn save_body(
    self: Arc<Self>,
    response: &mut Response
  ) -> anyhow::Result<()> {
    let mut downloaded: u64 = 0;
    let mut output_file = self.open_archive_file().await?;
    let body_size = response
      .content_length()
      .ok_or_else(|| anyhow::anyhow!("Unable to download client: The server did not provide a Content-Length header"))?;

    // Время для вычисления скорости загрузки
    let start_time = Instant::now();

    // грузим файл частями (чанками)
    while let Some(chunk) = response.chunk().await.unwrap() {
      // Todo сделать паузу...
      if *self.paused.lock().await {
        log::warn!("Download paused. Breaking loop");
        break;
      }

      // размеры туда сюда
      let chunk_size = chunk.len() as u64;
      downloaded += chunk_size;

      // сохраняем полученные данные в файлик
      output_file.write(&chunk)?;

      let elapsed_time = start_time.elapsed();

      if elapsed_time > Duration::ZERO {
        let speed = (chunk_size as f32/elapsed_time.as_secs_f32())/1_048_576.0; // 2^20
        self.set_speed(speed).await;
      }

      self.set_progress(DownloadableObject::calc_progress(downloaded, body_size)).await;
      self.set_state(downloaded.clone()).await;

      self.commit().await;
    }

    log::debug!("Download completed. Downloaded {:.2?}MB", (downloaded as f32/1_000_000.0));

    self.unpack().await?;

    Ok(())
  }

  /// ``INTERNAL``\
  /// Обновляет поле со скоростью загрузки
  async fn set_speed(&self, speed: f32) {
    *self.speed.lock().await = speed;
  }

  /// ``INTERNAL``\
  /// Обновляет поле с прогрессом загрузки (0%-100%)
  async fn set_progress(&self, progress: u8) {
    *self.progress.lock().await = progress;
  }

  /// ``INTERNAL``\
  /// Обновляет поле с количеством скачанных байт
  async fn set_state(&self, downloaded: u64) {
    *self.state.lock().await = downloaded;
  }

  /// Запускает/восстанавливает загрузку клиента
  async fn start(self: Arc<Self>) -> anyhow::Result<()> {
    self.clone().unpause();

    log::debug!("Starting download of ID({}) Name({})", self.id.lock().await, self.name.lock().await);
    let url = self.get_download_url().await;
    let me = Arc::clone(&self);

    let client = reqwest::Client::builder()
      .timeout(std::time::Duration::from_secs(10))
      .build()?;

    log::debug!("Downloading URL: {url}");

    let range = *self.state.lock().await;

    let mut response = client.get(url)
      .header(reqwest::header::RANGE, range.to_string())
      .send()
      .await?;

    me.save_body(&mut response).await?;

    Ok(())
  }

  /// Восстанавливает загрузку клиента
  async fn unpause(self: Arc<Self>) {
    *self.paused.lock().await = false;
    self.commit().await;
  }

  /// Останавливает загрузку клиента
  async fn pause(self: Arc<Self>) {
    *self.paused.lock().await = true;
    self.commit().await;
  }

  /// Возвращает структуру, которая имеет поля без мьютекса
  /// Мда... пиздец...
  async fn save_current_state(&self) -> DownloadableObjectNoMutex {
    DownloadableObjectNoMutex {
      id: self.id.lock().await.to_string(),
      name: self.name.lock().await.to_string(),
      speed: *self.speed.lock().await,
      progress: *self.progress.lock().await,
      state: *self.state.lock().await,
      paused: *self.paused.lock().await,
    }
  }

  /// Пушим изменения полей на фронтенд/
  async fn commit(&self) {
    let message = self.save_current_state().await;
    message::send::<DownloadableObjectNoMutex>(Some(&EMIT_EVENT_ID), "download", message).await;
  }

  /// Убирает клиент из очереди
  async fn remove(&self) {
    let queue = &mut *get_download_queue().lock().await;

    queue.remove(&self.id.lock().await);
  }
}

/// Очередь
/// Класс/структура, которая отвечает за распределение
/// загрузки клиентов
///
/// Примеры:
/// ```rs
/// // Создаем очередь
/// let queue = Queue::new()
/// // Обязательно запускаем поток для загрузки
/// queue.run_watch_thread();
/// // Добавит в очередь клиент magic-rpg, и начнет его загрузку, затем установку (распаковку архива).
/// queue.add("magic-rpg", "Magic RPG #1")
/// ```
pub(crate) struct Queue {
  /// Список-очередь
  queue: HashMap<String, Arc<DownloadableObject>>,
  /// Текущий скачиваемый клиент
  /// Some(айди downloadable)
  current_downloadable: Option<String>
}

impl Queue {
  fn new() -> Queue {
    Queue {
      queue: HashMap::<String, Arc<DownloadableObject>>::new(),
      current_downloadable: None
    }
  }

  /// Добавляет клиент в очередь загрузки
  /// todo: emit
  async fn add(
    &mut self,
    id: String,
    name: String
  ) {
    self.queue.insert(id.clone(), Arc::new(DownloadableObject::new(id.clone(), name)));

    self.set_current(id.clone());
    self.start_current().await;
  }

  // Устанавливает текущий скачиваемый клиент
  /// todo: emit
  fn set_current(
    &mut self,
    new: String
  ) {
    self.pause_current();
    self.current_downloadable = Some(new);
  }

  /// Включает загрузку/установку текущего клиента
  /// todo: emit
  async fn start_current(&mut self) {
    if let Some(id) = &self.current_downloadable {
      if let Some(curr) = self.queue.get(id) {
        let current = Arc::clone(curr);

        let result = current.clone().start().await;

        // Todo: emit
        match result {
          Ok(_) => {
            log::warn!("Скачали все");
            message::send::<CreateData>(Some(EMIT_EVENT_ID), "create", CreateData {
              id: id.clone(),
              name: current.name.lock().await.to_string()
            }).await;
          },
          Err(e) => {
            message::send::<String>(None, "ErrorInUI", format!("Не получилось скачать клиент: {}", e.to_string())).await;
          },
        };
      }
  }
  }

  /// Останавливает загрузку/установку текущего клиента
  fn pause_current(&self) {
    if let Some(id) = &self.current_downloadable {
      self.pause(id);
    }
  }

  /// Ставит на паузу DownloadableObject
  /// todo: emit
  fn pause(&self, id: &str) {
    if let Some(current) = self.queue.get(id) {
      current.clone().pause();
    }
  }

  /// todo: emit
  fn remove(
    &mut self,
    id: &str
  ) {
    if let Some(downloadable) = self.queue.get(id) {
      downloadable.clone().pause();
      self.queue.remove(id);
    }
  }
}