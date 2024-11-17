use super::AnyhowResult;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use lazy_static::lazy_static;

lazy_static! {
  /// Данные текущего пользователя
  static ref USER_DATA: Mutex<UserData> = Mutex::new(UserData::new());
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct UserData {
  pub username: String,
  pub jwt: String
}

impl UserData {
  fn new() -> UserData {
    UserData {
      username: String::new(),
      jwt: String::new()
    }
  }
}

#[tauri::command]
#[allow(non_snake_case)]
pub(crate) async fn updateUser(
  data: UserData
) -> AnyhowResult<()> {
  *USER_DATA.lock().await = data;

  Ok(())
}

pub(crate) async fn get_user() -> UserData {
  USER_DATA.lock().await.clone()
}