#[allow(unused)]
pub(crate) fn get_url() -> String {
  String::from("https://riverfall.ru")
}

pub(crate) fn get_session_server_url() -> String {
  String::from("https://riverfall.ru/api/session")
}

pub(crate) fn join_url(url: &str) -> String {
  format!("{}/{url}", get_url())
}