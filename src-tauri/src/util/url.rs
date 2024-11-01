// Да, https на localhost, сам вахуе
#[allow(unused)]
pub(crate) fn get_url() -> &'static str {
  if cfg!(debug_assertions) { "https://localhost" } else {"https://serenitymc.ru"}
}

pub(crate) fn join_url(
  url: &str
) -> String {
  format!("{}/{url}", get_url())
}