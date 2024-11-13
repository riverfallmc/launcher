use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use super::AnyhowResult;
use lazy_static::lazy_static;

lazy_static! {
  /// Данные текущего авторизированного пользователя
  static ref USER_DATA: Mutex<UserData> = Mutex::new(UserData::new());
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct UserData {
  /// Игровое имя игрока
  pub username: String,
  /// JWT
  // pub jwt: String
  pub password: String
}

impl UserData {
  fn new() -> UserData {
    UserData {
      username: String::new(),
      password: String::new()
      // jwt: String::new()
    }
  }
}

#[tauri::command]
#[allow(non_snake_case)]
pub(crate) async fn updateUserData(
  data: UserData
) -> AnyhowResult<()> {
  *USER_DATA.lock().await = data;

  Ok(())
}

pub(crate) async fn get_user() -> UserData {
  USER_DATA.lock().await.clone()
}