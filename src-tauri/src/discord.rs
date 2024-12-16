use crate::util::tauri::AnyhowResult;
use discord_rich_presence::{activity::{Activity, Assets, Button},DiscordIpc, DiscordIpcClient};
use serde::{Deserialize, Serialize};
use std::{sync::{atomic::{AtomicBool, Ordering::Relaxed},Mutex,}, thread, time::Duration};

const CLIENT_ID: &str = "1292519587945906249";
const RECONNECT_SECONDS: u64 = 15;

lazy_static::lazy_static! {
  pub(crate) static ref ACTIVITY: Mutex<Option<RpcActivity>> = Mutex::new(None);
}

/// Устанавливает активность Discord Rich Presence
pub(crate) fn set_drpc_activity(activity: RpcActivity) -> anyhow::Result<()> {
  let mut activity_lock = ACTIVITY
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to lock mutex: {e}"))?;

  *activity_lock = Some(activity);

  Ok(())
}

/// Возвращает активность Discord Rich Presence
fn get_drpc_activity() -> anyhow::Result<RpcActivity> {
  ACTIVITY
    .lock()
    .map_err(|e| anyhow::anyhow!("Unable to lock mutex: {e}"))?
    .clone()
    .ok_or_else(|| anyhow::anyhow!("Unable to get DRPC activity"))
}

/// Включен ли Discord Rich Presence
static ENABLED: AtomicBool = AtomicBool::new(false);

#[derive(Serialize, Deserialize, Clone, Debug)]
pub(crate) struct RpcButton {
  pub label: String,
  pub url: String,
}

impl RpcButton {
  pub fn build(&self) -> Button {
    Button::new(&self.label, &self.url)
  }
}

pub trait RpcButtonBuilder {
  fn build(&self) -> Vec<Button>;
}

impl RpcButtonBuilder for Vec<RpcButton> {
  fn build(&self) -> Vec<Button> {
    self.iter().map(RpcButton::build).collect()
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
  pub buttons: Vec<RpcButton>,
}

impl RpcActivity {
  pub fn build(&self) -> Activity<'_> {
    Activity::new()
      .details(&self.title)
      .state(&self.subtitle)
      .assets(
        Assets::new()
          .large_image(&self.image)
          .large_text("https://t.me/serenitymcru"),
      )
      .buttons(self.buttons.build())
  }
}

#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn setDrpcActivity(activity: RpcActivity) -> AnyhowResult<()> {
  Ok(set_drpc_activity(activity)?)
}

/// Включен ли Discord Rich Presence в лаунчере?
pub(crate) fn is_enabled() -> bool {
  ENABLED.load(Relaxed)
}

/// Включает/выключает Discord Rich Presence в лаунчере
pub(crate) fn set_enabled(value: bool) {
  ENABLED.store(value, Relaxed);
}

/// Команда для Tauri
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn isDrpcEnabled() -> bool {
  is_enabled()
}

/// Команда для Tauri
#[tauri::command]
#[allow(non_snake_case)]
pub(crate) fn setDrpcEnabled(enabled: bool) {
  set_enabled(enabled);
  log::info!("Discord Rich Presense {}abled", if enabled {"en"} else {"dis"});
}

/// Функция, создающая поток, который проверяет статус Discord Rich Presence
pub(crate) fn run_rpc() {
  log::info!("Starting Discord RPC");

  thread::spawn(move || {
    log::debug!("Discord RPC thread created");

    loop {
      if setup_rpc()
        .map_err(setup_error_handler)
        .is_ok() {break}
    }
  });
}

fn setup_error_handler(e: anyhow::Error) {
  anyhow::anyhow!("Discord Rich Presence setup error: {e}");

  std::thread::sleep(Duration::from_secs(RECONNECT_SECONDS));
}

#[allow(unused_must_use)]
fn setup_rpc() -> anyhow::Result<()> {
  log::debug!("Setting up Discord RPC");

  let mut client = DiscordIpcClient::new(CLIENT_ID)
    .map_err(|err| anyhow::anyhow!("Failed to create DiscordIpcClient: {err}"))?;

  log::debug!("Connecting to Discord...");
  client
    .connect()
    .map_err(|err| anyhow::anyhow!("Error connecting to Discord: {err}"))?;

  log::info!("Discord RPC connection established, updating activity...");

  loop {
    if is_enabled() {
      if let Ok(activity) = get_drpc_activity() {
        client
          .set_activity(activity.build())
          .map_err(|err| anyhow::anyhow!("Error setting activity: {err}"))?;
      }
    } else {
      client.clear_activity();
    }

    thread::sleep(Duration::from_secs(2));
  }
}