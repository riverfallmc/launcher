use super::{
    clientinfo::ClientInfo,
    session_manager,
    variables::{GameArguments, LibraryPathFormat},
};
use crate::util::{pathbuf::PathBufToString, url::get_session_server_url};
use anyhow::Context;
use mc_version_parser::{arguments::Substitution, libraries::LibrariesCollect, types::VersionData};
use std::path::Path;

pub(crate) struct Arguments {
    // Айпи сервера, к которому будем подключатся
    pub ip: Option<String>,
}

const CLASSPATH_SEPARATOR: &str = if cfg!(target_os = "windows") {
    ";"
} else {
    ":"
};

pub(crate) async fn generate(
    id: i32,
    username: String,
    jwt: String,
    arguments: Arguments,
    dir: &String,
    mut data: VersionData,
    client: ClientInfo,
) -> anyhow::Result<Vec<String>> {
    let path = Path::new(dir);

    // Собираем все используемые клиентом библиотеки
    let libraries = path.join("libraries");

    let mut libs = data
        .libraries
        .collect()
        .into_iter()
        .map(|mut lib| lib.format(&libraries))
        .collect::<anyhow::Result<Vec<String>>>()?;

    libs.push(
        client
            .get_jar(dir)?
            .to_str()
            .context("Unable to join two paths")?
            .to_string(),
    );

    let session = session_manager::request(jwt, id, &username).await?;

    // Собираем/подставляем все переменные
    // которые будут подставлены в аргументы
    // процесса джавы
    let variables = GameArguments {
        website: get_session_server_url(),
        natives_directory: client.get_folder(dir)?.join("natives").to_string()?,
        launcher_name: "java-minecraft-launcher".to_string(),
        launcher_version: "1.6.84-j".to_string(),
        classpath: libs.join(CLASSPATH_SEPARATOR),
        auth_player_name: username,
        version_name: data.id,
        game_directory: dir.to_string(),
        game_libraries_directory: libraries.to_string()?,
        assets_root: path.join("assets").to_string()?,
        assets_index_name: data.assets,
        auth_uuid: session.uuid,
        auth_access_token: session.access_token,
        main_class: data.mainClass,
        user_type: "mojang".to_string(),
        version_type: data.r#type,
        width: "925".to_owned(),
        height: "530".to_owned(),
        server_ip: arguments.ip.unwrap_or("".to_string()),
    };

    Ok(data.arguments.collect().values(variables.collect()))
}
