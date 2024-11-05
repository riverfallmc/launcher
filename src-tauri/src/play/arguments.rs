use std::path::Path;
use anyhow::Context;
use mc_version_parser::{arguments::Substitution, libraries::LibrariesCollect, types::VersionData};
use crate::util::{pathbuf::PathBufToString, tauri::userdata::get_user};
use super::{clientinfo::ClientInfo, session_manager, variables::{GameArguments, LibraryPathFormat}};

pub(crate) struct Arguments {
  // Айпи сервера, к которому будем подключатся
  pub ip: Option<String>,
}

pub(crate) async fn generate(
  arguments: Arguments,
  dir: &String,
  mut data: VersionData,
  client: ClientInfo
) -> anyhow::Result<Vec<String>> {
  // Получаем данные пользователя
  let user = get_user().await;
  let path = Path::new(dir);

  // Собираем все используемые клиентом библиотеки
  let libraries = path.join("libraries").to_string()?;

  let mut libs = data.libraries
    .collect()
    .into_iter()
    .map(|mut lib| {lib.format(&libraries)})
    .collect::<Vec<String>>();

  libs.push(client.get_jar(dir)?.to_str().context("Unable to join two paths")?.to_string());

  let session = session_manager::request().await?;

  // Собираем/подставляем все переменные
  // которые будут подставлены в аргументы
  // процесса джавы
  let variables = GameArguments {
    natives_directory: client.get_folder(dir)?.join("natives").to_string()?,
    launcher_name: "java-minecraft-launcher".to_string(),
    launcher_version: "1.6.84-j".to_string(),
    classpath: libs.join(";"),
    auth_player_name: user.username,
    version_name: data.id,
    game_directory: dir.to_string(),
    assets_root: path.join("assets").to_string()?,
    assets_index_name: data.assets,
    auth_uuid: session.uuid,
    auth_access_token: session.token,
    main_class: data.mainClass,
    user_type: "mojang".to_string(),
    version_type: data.r#type,
    width: "900".to_owned(),
    height: "550".to_owned(),
    server_ip: arguments.ip.unwrap_or("".to_string())
  };

  Ok(data.arguments.collect().values(variables.collect()))
}