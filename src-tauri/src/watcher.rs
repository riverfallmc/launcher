use std::{path::PathBuf, sync::Arc};
use anyhow::Result;
use tokio::{process::Child, sync::Mutex, task::JoinHandle};
use crate::logger::ProcessLogger;

/// Структура, смотрящая за процессами
///
/// Также поддерживает подключение логгера, который
/// будет считывать stdout процесса и в отдельном потоке записывать логи
/// в файл.
pub struct ProcessWatcher {
  process: Arc<Mutex<Child>>,
  on_exit: Option<Box<dyn FnOnce() + Send>>,
  logger: Option<ProcessLogger>
}

impl ProcessWatcher {
  pub fn new(child: Child) -> Self {
    Self {
      process: Arc::new(Mutex::new(child)),
      on_exit: None,
      logger: None
    }
  }

  pub fn on_exit<F>(&mut self, closure: F) -> &Self
    where F: FnOnce() + Send + 'static
  {
    self.on_exit = Some(Box::new(closure));
    self
  }

  pub fn enable_logger(&mut self, path: PathBuf) -> Result<&Self> {
    self.logger = Some(ProcessLogger::new(self.process.clone(), path));
    Ok(self)
  }

  async fn handle(self) {
    let result = self.process.lock().await
      .wait().await;

    log::info!("Process exited: {result:?}");

    if let Some(on_exit) = self.on_exit {
      on_exit();
    }
  }

  pub async fn spawn_thread(self) -> JoinHandle<()> {
    if let Some(logger) = &self.logger {
      if let Err(err) = logger.spawn().await {
        log::error!("Unable to spawn logger thread: {err}");
      }
    }

    tokio::spawn(async move {
      self.handle()
        .await;
    })
  }
}