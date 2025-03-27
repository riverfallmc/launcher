#[allow(unused)]
pub(crate) fn get_url() -> String {
  if cfg!(debug_assertions) {
    String::from("https://192.168.0.13")
  } else {
    String::from("https://riverfall.ru")
  }
}

pub(crate) fn get_session_server_url() -> String {
  if cfg!(debug_assertions) {
    String::from("https://192.168.0.13/api/session")
  } else {
    String::from("https://riverfall.ru/api/session")
  }
}

pub(crate) fn join_url(url: &str) -> String {
  format!("{}/{url}", get_url())
}