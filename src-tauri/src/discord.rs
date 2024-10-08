use crate::util::tauri::AnyhowResult;
use serde::{Deserialize, Serialize};
use std::{sync::{atomic::{AtomicBool, Ordering::Relaxed}, Mutex}, thread, time::Duration};
use discord_rich_presence::{activity::{Activity, Assets, Button}, DiscordIpc, DiscordIpcClient};

lazy_static::lazy_static! {
  pub(crate) static ref ACTIVITY: Mutex<Option<RpcActivity>> = Mutex::new(None);
}

/// Устанавливает активность Discord Rich Presence
pub(crate) fn set_drpc_activity(
  activity: RpcActivity
) -> anyhow::Result<()> {
  let mut activity_lock = ACTIVITY
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to lock mutex: {e}"))?;

  *activity_lock = Some(activity);

  Ok(())
}

/// Возвращает активность Discord Rich Presence
fn get_drpc_activity() -> anyhow::Result<RpcActivity> {
  Ok(ACTIVITY
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to lock mutex: {e}"))?.clone()
    .ok_or_else(|| anyhow::anyhow!("Unable to get DRPC activity"))?)
}

/// Включен ли Discord Rich Presence
static ENABLED: AtomicBool = AtomicBool::new(false);

#[derive(Serialize, Deserialize, Clone, Debug)]
pub(crate) struct RpcButton {
  pub label: String,
  pub url: String
}

impl RpcButton {
  pub fn build<'a>(&self) -> Button {
    Button::new(&self.label, &self.url)
  }
}

pub trait RpcButtonBuilder {
  fn build(&self) -> Vec<Button>;
}

impl RpcButtonBuilder for Vec<RpcButton> {
  fn build(&self) -> Vec<Button> {
    self.iter()
      .map(RpcButton::build)
      .collect()
  }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub(crate) struct RpcActivity {
  /// Картинка
  pub image: String,
  /// Верхняя надпись (details)
  pub title: String,
  /// Нижняя надпись (state)
  pub subtitle: String,
  /// Кнопки
  pub buttons: Vec<RpcButton>
}

impl RpcActivity {
  pub fn build(&self) -> Activity<'_> {
    Activity::new()
      .details(&self.title)
      .state(&self.subtitle)
      .assets(Assets::new().large_image(&self.image).large_text("https://t.me/serenitymcru"))
      .buttons(self.buttons.build())
  }
}

/// TODO
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn setDrpcActivity(
  activity: RpcActivity
) -> AnyhowResult<()> {
  Ok(set_drpc_activity(activity)?)
}

/// Включен ли Discord Rich Presence в лаунчере?
pub(crate) fn is_enabled() -> bool {
  return ENABLED.load(Relaxed)
}

/// Включает/выключает Discord Rich Presence в лаунчере
pub(crate) fn set_enabled(value: bool) {
  ENABLED.store(value, Relaxed);
}

/// Команда для Tauri
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn isDrpcEnabled() -> bool {
  return is_enabled();
}

/// Команда для Tauri
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn setDrpcEnabled(enabled: bool) {
  set_enabled(enabled);
}

/// Функция, создающая поток, который проверяет статус Discord Rich Presence
pub(crate) fn run_rpc() {
  log::info!("Starting Discord RPC");

  thread::spawn(move || {
    log::debug!("Discord RPC thread created");

    if let Err(err) = setup_rpc() {
      log::error!("Error during Discord RPC setup: {err}");
    }
  });
}

fn setup_rpc() -> anyhow::Result<()> {
  log::info!("Setting up Discord RPC");

  let mut client = DiscordIpcClient::new("1292519587945906249")
    .map_err(|err| anyhow::anyhow!("Failed to create DiscordIpcClient: {err}"))?;

  log::info!("Connecting to Discord...");
  client.connect()
    .map_err(|err| anyhow::anyhow!("Error connecting to Discord: {err}"))?;

  log::info!("Connection established, updating activity...");

  loop {
    match get_drpc_activity() {
      Ok(activity) => {
        client.set_activity(activity.build())
          .map_err(|err| anyhow::anyhow!("Error setting activity: {err}"))?;
      },
      Err(_) => {
        log::warn!("Discord RPC activity not set, retrying in 2 seconds...");
      }
    }

    thread::sleep(Duration::from_secs(2));
  }
}
