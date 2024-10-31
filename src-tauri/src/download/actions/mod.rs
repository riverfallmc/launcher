/**
 * Это будет единственный, хоть как-то документированный модуль
 * И только потому-что тут просто полный пиздец по логике, и запутаться как нехуй делать, лол))
 */

use std::sync::Mutex;
use hashbrown::HashMap;
use lazy_static::lazy_static;

pub(crate) mod create;
pub(crate) mod read;
pub(crate) mod update;
pub(crate) mod delete;

lazy_static! {
  /// Singleton очереди приложения
  static ref DOWNLOAD_QUEUE: Mutex<Queue> = {
    let queue = Queue::new();
    queue.run_watch_thread();

    Mutex::new(queue)
  };
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

/// Клиент
#[allow(unused)]
pub(crate) struct DownloadableObject {
  // magic-rpg
  pub id: String,
  // Magic RPG №1
  pub name: String,
  // 10.4 мбайт/с
  pub speed: f32,
  // 100%
  pub progress: u8,
  // false
  pub paused: bool
}

impl Default for DownloadableObject {
  fn default() -> Self {
    DownloadableObject {
      id: String::new(),
      name: String::new(),
      speed: 0.0,
      progress: 0,
      paused: false
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

  /// Запускает/восстанавливает загрузку клиента
  fn start(&self) {}

  // Останавливает загрузку клиента
  fn pause(&self) {}
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
  queue: HashMap<String, DownloadableObject>,
  /// Текущий скачиваемый клиент
  /// Some(айди downloadable)
  current_downloadable: Option<String>
}

impl Queue {
  fn new() -> Queue {
    Queue {
      queue: HashMap::<String, DownloadableObject>::new(),
      current_downloadable: None
    }
  }

  /// Добавляет клиент в очередь загрузки
  fn add(
    &mut self,
    id: String,
    name: String
  ) {
    self.set_current(id.clone());
    self.start_current();

    self.queue.insert(id.clone(), DownloadableObject::new(id, name));
  }

  // Устанавливает текущий скачиваемый клиент
  fn set_current(
    &mut self,
    new: String
  ) {
    self.pause_current();
    self.current_downloadable = Some(new);
  }

  /// Включает загрузку/установку текущего клиента
  fn start_current(&self) {
    if let Some(id) = &self.current_downloadable {
      if let Some(current) = self.queue.get(id) {
        current.start();
      }
    }
  }

  /// Останавливает загрузку/установку текущего клиента
  fn pause_current(&self) {
    if let Some(id) = &self.current_downloadable {
      if let Some(current) = self.queue.get(id) {
        current.pause();
      }
    }
  }

  /// Запускает поток, которые смотрит очередь и скачивает оттуда клиент
  pub fn run_watch_thread(&self) {
    std::thread::spawn(move || {
      // loop {
      //   let current = self.current_downloadable.clone();

      //   if !current.is_some() {
      //     continue;
      //   }

      // }
    });
  }
}