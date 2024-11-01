#![allow(unused)]
/**
 * Это будет единственный, хоть как-то документированный модуль
 * И только потому-что тут просто полный пиздец по логике, и запутаться как нехуй делать, лол))
 */

use std::sync::{Arc, Mutex};
use hashbrown::HashMap;
use lazy_static::lazy_static;
use reqwest::Response;
use tokio::{runtime::Runtime, task::{self, JoinHandle}};
use tauri::async_runtime::TokioJoinHandle;

use crate::util::url::join_url;

pub(crate) mod create;
pub(crate) mod read;
pub(crate) mod update;
pub(crate) mod delete;

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
  id: String,
  /// Название клиента
  // Magic RPG №1
  name: String,
  /// Скорость загрузки
  // 10.4 мбайт/с
  speed: f32,
  /// Процентное отношение загруженного контента
  // 100%
  progress: u8,
  /// Статус загрузки (сколько байт уже скачалось)
  // 0 мб
  state: usize,
  /// Поставлена ли загрузка на паузу?
  // false
  paused: bool
}

impl Default for DownloadableObject {
  fn default() -> Self {
    DownloadableObject {
      id: String::new(),
      name: String::new(),
      speed: 0.0,
      progress: 0,
      state: 0,
      paused: false,
    }
  }
}

impl DownloadableObject {
  fn new(
    id: String,
    name: String
  ) -> DownloadableObject {
    DownloadableObject {
      id,
      name,
      ..Default::default()
    }
  }

  // https://localhost/client/magic-rpg
  fn get_download_url(&self) -> String {
    join_url(&format!("client/{}.zip", self.id))
  }

  async fn save_body(
    self: Arc<Self>,
    response: &mut Response
  ) {
    let mut downloaded: usize = 0;

    while let Some(chunk) = response.chunk().await.unwrap() {
      let size = chunk.len();
      downloaded += size;
    }

    log::debug!("Download completed. Downloaded {}MB", downloaded/1_000_000);
  }

  /// Запускает/восстанавливает загрузку клиента
  /// Todo 💡 @ если self.paused, то убиваем поток нахуй
  async fn start(self: Arc<Self>) {
    log::debug!("Start downloading id({}) name({})", self.id, self.name);
    let url = self.get_download_url();
    let me = Arc::clone(&self);

    let client = reqwest::Client::builder()
      .timeout(std::time::Duration::from_secs(10))
      .build()
      .unwrap();

    let mut response = client.get(url)
      .send()
      .await
      .unwrap();

    me.save_body(&mut response).await;
  }

  // Останавливает загрузку клиента
  fn pause(&self) {}

  /// Убирает клиент из очереди
  fn remove(&self) {
    let queue = &mut *get_download_queue().lock().unwrap();

    queue.remove(&self.id);
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
            current.start().await;
          }).await;

          println!("{ass:?}");
        });
      }
    }
  }

  /// Останавливает загрузку/установку текущего клиента
  /// todo: emit
  fn pause_current(&self) {
    if let Some(id) = &self.current_downloadable {
      if let Some(current) = self.queue.get(id) {
        current.pause();
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