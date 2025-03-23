use std::env;

// Да, https на localhost, сам вахуе
#[allow(unused)]
pub(crate) fn get_url() -> String {
    if cfg!(debug_assertions) {
        String::from("https://192.168.0.13")
    } else {
        format!(
            "https://{}",
            env::var("LOCAL_SERVER").unwrap_or(String::from("riverfall.ru"))
        ) // todo @ заменить просто на riverfall.ru
          // "https://riverfall.ru"
    }
}

pub(crate) fn get_session_server_url() -> String {
    if cfg!(debug_assertions) {
        String::from("https://192.168.0.13/api/session")
    } else {
        format!(
            "https://{}/api/session",
            env::var("LOCAL_SERVER").unwrap_or(String::from("riverfall.ru"))
        ) // todo @ заменить просто на riverfall.ru
          // "https://{}/api/session"
    }
}

pub(crate) fn join_url(url: &str) -> String {
    format!("{}/{url}", get_url())
}
