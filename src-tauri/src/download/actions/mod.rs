#![allow(unused)]
/**
 * Это будет единственный, хоть как-то документированный модуль
 * И только потому-что тут просто полный пиздец по логике, и запутаться как нехуй делать, лол))
 */

use std::{borrow::BorrowMut, sync::{Arc, Mutex}};
use hashbrown::HashMap;
use lazy_static::lazy_static;
use reqwest::Response;
use tokio::{runtime::Runtime, task::{self, JoinHandle}};
use tauri::{async_runtime::TokioJoinHandle, Emitter};
use crate::util::{tauri::get_main_window, url::join_url};

pub(crate) mod create;
pub(crate) mod read;
pub(crate) mod update;
pub(crate) mod delete;

const EMIT_EVENT_ID: &'static str = "downloadThread";

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

/// Единица скачиваемого клиента
#[allow(unused)]
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
  state: Mutex<usize>,
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
      ..Default::default()
    }
  }

  // https://localhost/client/magic-rpg
  fn get_download_url(&self) -> String {
    join_url(&format!("client/{}.zip", self.id.lock().unwrap()))
  }

  async fn save_body(
    self: Arc<Self>,
    response: &mut Response
  ) {
    let mut downloaded: usize = 0;

    // грузим файл частями (чанками)
    while let Some(chunk) = response.chunk().await.unwrap() {
      if *self.paused.lock().unwrap() {
        self.commit();
        break;
      }

      let size = chunk.len();
      downloaded += size;
    }

    log::debug!("Download completed. Downloaded {}MB", downloaded/1_000_000);
  }

  /// Запускает/восстанавливает загрузку клиента
  async fn start(self: Arc<Self>) -> anyhow::Result<()> {
    log::debug!("Starting download of ID({}) Name({})", self.id.lock().unwrap(), self.name.lock().unwrap());
    let url = self.get_download_url();
    let me = Arc::clone(&self);

    let client = reqwest::Client::builder()
      .timeout(std::time::Duration::from_secs(10))
      .build()?;

    let mut response = client.get(url)
      .send()
      .await?;

    me.save_body(&mut response).await;

    Ok(())
  }

  /// Останавливает загрузку клиента
  fn pause(self: Arc<Self>) {
    *self.paused.lock().unwrap() = true;
  }

  /// Пушим изменения полей на фронтенд/
  /// Todo: Доделать
  fn commit(&self) {
    let window = get_main_window().unwrap();
    window.emit(&EMIT_EVENT_ID, {});
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
    self.set_current(id.clone());
    self.start_current();

    self.queue.insert(id.clone(), Arc::new(DownloadableObject::new(id, name)));
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