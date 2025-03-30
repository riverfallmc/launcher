use std::{collections::HashMap, path::Path};

use anyhow::Result;

use crate::util::pathbuf::PathBufToString;

#[allow(unused)]
pub(crate) struct PlayArguments<'a> {
    pub username: String,
    pub token: String,
    pub ip: Option<String>,
    pub client: &'a str,
    pub version_file: String,
}

#[allow(non_snake_case)]
#[derive(Clone)]
pub(crate) struct GameArguments {
    pub website: String,
    pub natives_directory: String,
    pub launcher_name: String,
    pub launcher_version: String,
    pub classpath: String,
    pub auth_player_name: String,
    pub version_name: String,
    pub game_directory: String,
    pub assets_root: String,
    pub assets_index_name: String,
    pub auth_uuid: String,
    pub auth_access_token: String,
    pub main_class: String,
    pub user_type: String,
    pub version_type: String,
    pub width: String,
    pub height: String,
    pub server_ip: String,
    pub game_libraries_directory: String,
}

impl GameArguments {
    pub fn collect(&self) -> HashMap<String, String> {
        let mut hashmap: HashMap<String, String> = HashMap::new();

        hashmap.insert("website".to_string(), self.website.clone());
        hashmap.insert(
            "natives_directory".to_string(),
            self.natives_directory.clone(),
        );
        hashmap.insert("launcher_name".to_string(), self.launcher_name.clone());
        hashmap.insert(
            "launcher_version".to_string(),
            self.launcher_version.clone(),
        );
        hashmap.insert("classpath".to_string(), self.classpath.clone());
        hashmap.insert(
            "auth_player_name".to_string(),
            self.auth_player_name.clone(),
        );
        hashmap.insert("version_name".to_string(), self.version_name.clone());
        hashmap.insert("game_directory".to_string(), self.game_directory.clone());
        hashmap.insert(
            "game_libraries_directory".to_string(),
            self.game_libraries_directory.clone(),
        );
        hashmap.insert("assets_root".to_string(), self.assets_root.clone());
        hashmap.insert(
            "assets_index_name".to_string(),
            self.assets_index_name.clone(),
        );
        hashmap.insert("auth_uuid".to_string(), self.auth_uuid.clone());
        hashmap.insert(
            "auth_access_token".to_string(),
            self.auth_access_token.clone(),
        );
        hashmap.insert("main_class".to_string(), self.main_class.clone());
        hashmap.insert("user_type".to_string(), self.user_type.clone());
        hashmap.insert("version_type".to_string(), self.version_type.clone());
        hashmap.insert("width".to_string(), self.width.clone());
        hashmap.insert("height".to_string(), self.height.clone());
        hashmap.insert(
            "server_ip".to_string(),
            self.server_ip
                .clone()
                .split(":")
                .collect::<Vec<&str>>()
                .first()
                .unwrap()
                .to_string(),
        );

        hashmap
    }
}

pub trait LibraryPathFormat {
    fn format(&mut self, client: &Path) -> Result<String>;
}

impl LibraryPathFormat for String {
    fn format(&mut self, client: &Path) -> Result<String> {
        let parts: Vec<&str> = self.split(':').collect();
        let subparts: Vec<&str> = parts[0].split('.').collect();
        let joined_subparts = subparts.join(std::path::MAIN_SEPARATOR_STR);

        client
            .join(joined_subparts)
            .join(parts[1])
            .join(parts[2])
            .join(format!("{}-{}.jar", parts[1], parts[2]))
            .to_string()
    }
}
