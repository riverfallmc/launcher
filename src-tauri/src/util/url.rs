// Да, https на localhost, сам вахуе
#[allow(unused)]
pub(crate) fn get_url() -> &'static str {
  if cfg!(debug_assertions) { "https://localhost" } else {"https://riverfall.ru"}
}

pub(crate) fn get_session_server_url() -> &'static str {
  if cfg!(debug_assertions) { "http://localhost:1025" } else {"https://riverfall.ru/api/session"}
}

pub(crate) fn join_url(
  url: &str
) -> String {
  format!("{}/{url}", get_url())
}