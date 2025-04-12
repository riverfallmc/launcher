use anyhow::Result;
use std::{fs::File, io::BufReader, path::Path};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Versions {
  pub game: String,
  pub java: usize
}

#[derive(Serialize, Deserialize)]
pub struct ClientDetails {
  pub name: String,
  pub versions: Versions
}

impl ClientDetails {
  pub fn from(client_path: &str) -> Result<Self> {
    let path = Path::new(client_path)
      .join("client.json");

    println!("Path: {path:?}");

    path.try_exists()?;

    let file = File::open(path)?;

    Ok(serde_json::from_reader(BufReader::new(file))?)
  }
}