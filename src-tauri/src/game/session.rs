use std::sync::LazyLock;
use anyhow::Result;
use mc_launcher::minecraft::configuration::MinecraftSession;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::utils::AppUrls;

static AUTHORIZATION_ENDPOINT: LazyLock<String> = LazyLock::new(|| AppUrls::with_api("session", "join"));
static CLIENT: LazyLock<Client> = LazyLock::new(Client::default);

// TODO @ Изменить когда появится нормальный API Gateway
#[derive(Serialize, Deserialize)]
struct AuthorizationQuery {
  pub id: i32,
  pub username: String
}

pub struct SessionService;

impl SessionService {
  pub async fn authorizate(_jwt: String, id: i32, username: &String) -> Result<MinecraftSession<'static>> {
    CLIENT.get(AUTHORIZATION_ENDPOINT.clone())
      .query(&AuthorizationQuery {id, username: username.to_owned()});

    todo!()
  }
}