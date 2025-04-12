use std::sync::LazyLock;
use anyhow::Result;
use mc_launcher::minecraft::configuration::{AuthLibConfiguration, MinecraftSession, MinecraftSessionUserType};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::utils::AppUrls;

static AUTHORIZATION_ENDPOINT: LazyLock<String> = LazyLock::new(|| AppUrls::with_api("session", "login"));
static CLIENT: LazyLock<Client> = LazyLock::new(Client::default);

// TODO @ Изменить когда появится нормальный API Gateway
#[derive(Serialize, Deserialize)]
struct AuthorizationQuery {
  pub id: i32,
  pub username: String
}

#[derive(Deserialize)]
struct AuthorizationResponse {
  #[serde(rename = "selectedProfile")]
  pub uuid: String,
  #[serde(rename = "accessToken")]
  pub access_token: String
}

pub struct SessionService;

impl SessionService {
  pub async fn authorizate(_jwt: String, id: i32, username: &String) -> Result<MinecraftSession> {
    let response = CLIENT.post(AUTHORIZATION_ENDPOINT.clone())
      .query(&AuthorizationQuery {id, username: username.to_owned()})
      .send().await?
      .json::<AuthorizationResponse>().await?;

    Ok(
      MinecraftSession {
        username: username.to_owned(),
        user_type: Some(MinecraftSessionUserType::Mojang),
        uuid: response.uuid,
        access_token: response.access_token,
        authlib_server: Some(AuthLibConfiguration {
          server: AppUrls::api("session"),
          version: String::from("1.2.5")
        })
      }
    )
  }
}