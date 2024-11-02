#![allow(unused)]
/**
 * Это будет единственный, хоть как-то документированный модуль
 * И только потому-что тут просто полный пиздец по логике, и запутаться как нехуй делать, лол))
 */

use std::{borrow::BorrowMut, fs::{self, File}, io::Write, path::Path, sync::{Arc, Mutex}};
use hashbrown::HashMap;
use lazy_static::lazy_static;
use reqwest::Response;
use serde::{Deserialize, Serialize};
use tokio::{runtime::Runtime, task::{self, JoinHandle}};
use tauri::{async_runtime::TokioJoinHandle, Emitter};
use crate::util::{tauri::get_main_window, url::join_url};

pub(crate) mod create;
pub(crate) mod read;
pub(crate) mod update;
pub(crate) mod delete;

const EMIT_EVENT_ID: &'static str = "downloadThread";
const ARCHIVE_NAME: &'static str = "gameclient.zip";

lazy_static! {
  /// Singleton очереди приложения
  static ref DOWNLOAD_QUEUE: Mutex<Queue> = Mutex::new(Queue::new());
}

/// Возвращает глобальную (ну она типо как singleton) очередь приложения
/// в виде мьютекса, так что если надо как-то с ней взаимодействовать
/// то держи пример как это делать:
/// ```rs
/// let queue = &mut *get_download_queue().lock().unwrap();
/// queue.add(String::from("magic-rpg"), String::from("Magic RPG #1"));
/// ```
pub(crate) fn get_download_queue() -> &'static Mutex<Queue> {
  &DOWNLOAD_QUEUE
}

/// DownloadableObject без мьютекса
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
// #[allow(unused)]
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

  // https://localhost/client/magic-rpg
  fn get_download_url(&self) -> String {
    join_url(&format!("client/{}.zip", self.id.lock().unwrap()))
  }

  fn calc_progress(downloaded: u64, body_size: u64) -> u8 {
    ((downloaded as f32/body_size as f32)*100.0) as u8
  }

  fn open_archive_file(&self) -> anyhow::Result<File> {
    if Path::new(ARCHIVE_NAME).exists() {
      fs::remove_file(ARCHIVE_NAME);
    }

    Ok(File::create(ARCHIVE_NAME)?)
  }

  async fn save_body(
    self: Arc<Self>,
    response: &mut Response
  ) -> anyhow::Result<()> {
    let mut downloaded: u64 = 0;
    let body_size = response
      .content_length()
      .unwrap_or_default() as u64;

    log::debug!("Downloadable file size: {body_size}");

    let mut output_file = self.open_archive_file()?;

    // грузим файл частями (чанками)
    while let Some(chunk) = response.chunk().await.unwrap() {
      if *self.paused.lock().unwrap() {
        log::warn!("Download paused. Breaking loop");
        break;
      }

      // размеры туда сюда
      let size = chunk.len() as u64;
      downloaded += size;

      // сохраняем полученные данные в файлик
      output_file.write(&chunk)?;

      // TODO вычислить это вот
      let speed = 0 as f32;

      self.set_speed(speed);
      self.set_progress(DownloadableObject::calc_progress(downloaded, body_size));
      self.set_state(downloaded.clone());

      self.commit();
    }

    log::debug!("Download completed. Downloaded {:.2?}MB", (downloaded as f32/1_000_000.0));

    Ok(())
  }

  fn set_speed(&self, speed: f32) {
    *self.speed.lock().unwrap() = speed;
  }

  fn set_progress(&self, progress: u8) {
    *self.progress.lock().unwrap() = progress;
  }

  fn set_state(&self, downloaded: u64) {
    *self.state.lock().unwrap() = downloaded;
  }

  /// Запускает/восстанавливает загрузку клиента
  async fn start(self: Arc<Self>) -> anyhow::Result<()> {
    self.clone().unpause();

    log::debug!("Starting download of ID({}) Name({})", self.id.lock().unwrap(), self.name.lock().unwrap());
    let url = self.get_download_url();
    let me = Arc::clone(&self);

    let client = reqwest::Client::builder()
      .timeout(std::time::Duration::from_secs(10))
      .build()?;

    log::debug!("Downloading URL: {url}");

    let range = *self.state.lock().unwrap();

    let mut response = client.get(url)
      .header(reqwest::header::RANGE, range.to_string())
      .send()
      .await?;

    me.save_body(&mut response).await?;

    Ok(())
  }

  /// Восстанавливает загрузку клиента
  fn unpause(self: Arc<Self>) {
    *self.paused.lock().unwrap() = false;
    self.commit();
  }

  /// Останавливает загрузку клиента
  fn pause(self: Arc<Self>) {
    *self.paused.lock().unwrap() = true;
    self.commit();
  }

  /// Возвращает структуру, которая имеет поля без мьютекса
  /// Мда... пиздец...
  fn save_current_state(&self) -> DownloadableObjectNoMutex {
    DownloadableObjectNoMutex {
      id: self.id.lock().unwrap().to_string(),
      name: self.name.lock().unwrap().to_string(),
      speed: *self.speed.lock().unwrap(),
      progress: *self.progress.lock().unwrap(),
      state: *self.state.lock().unwrap(),
      paused: *self.paused.lock().unwrap(),
    }
  }

  /// Пушим изменения полей на фронтенд/
  /// Todo: Доделать
  fn commit(&self) {
    let window = get_main_window().unwrap();
    window.emit::<DownloadableObjectNoMutex>(&EMIT_EVENT_ID, self.save_current_state());
  }

  /// Убирает клиент из очереди
  fn remove(&self) {
    let queue = &mut *get_download_queue().lock().unwrap();

    queue.remove(&self.id.lock().unwrap());
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
  fn add(
    &mut self,
    id: String,
    name: String
  ) {
    self.queue.insert(id.clone(), Arc::new(DownloadableObject::new(id.clone(), name)));

    self.set_current(id.clone());
    self.start_current();
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
  fn start_current(&mut self) {
    let rt = Runtime::new().unwrap();

    if let Some(id) = &self.current_downloadable {
      if let Some(curr) = self.queue.get(id) {
        let current = Arc::clone(curr);
        rt.block_on(async {
          let ass = tokio::spawn(async move {
            // todo: match => log
            current.start().await
          }).await;

          println!("{ass:?}");
        });
      }
    }
  }

  /// Останавливает загрузку/установку текущего клиента
  /// todo: emit
  fn pause_current(&mut self) {
    if let Some(id) = &self.current_downloadable {
      if let Some(current) = self.queue.get(id) {
        current.clone().pause();
      }
    }
  }

  /// todo: emit
  fn remove(
    &mut self,
    id: &str
  ) {
    self.queue.remove(id);
  }
}