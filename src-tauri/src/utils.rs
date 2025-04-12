use crate::util::tauri::TauriResult;
use anyhow::{anyhow, Context};
use tokio::{fs, task};
use zip::ZipArchive;
use std::{env::var, fs::File, path::Path, sync::Arc};

pub struct AppUrls;

impl AppUrls {
  #[allow(unused)]
  pub fn base() -> &'static str {
    "https://riverfall.ru"
  }

  #[allow(unused)]
  pub fn api(service: &str) -> String {
    // "https://riverfall.ru/api/session"
    format!("{}/api/{service}/", Self::base())
  }

  pub fn with_api(service: &str, endpoint: &str) -> String {
    format!("{}/api/{service}/{endpoint}", Self::base())
  }

  #[allow(unused)]
  pub fn join(url: &str) -> String {
    format!("{}/{url}", Self::base())
  }
}

// Operations with File System

#[tauri::command]
pub async fn fs_unzip(path: String) -> TauriResult<()> {
  let path = Arc::new(path);
  let unpack_dir = Path::new(&*path)
    .parent()
    .context(anyhow!("unable to get parent directory #1"))?
    .to_path_buf();

  let path_clone = Arc::clone(&path);

  let file = File::open(&*path_clone)
    .map_err(|e| anyhow!(e))?;

  task::spawn_blocking(move || {
    let mut archive = ZipArchive::new(file)?;

    for i in 0..archive.len() {
      let mut file = archive.by_index(i)?;
      let outpath = unpack_dir.join(file.name());

      if file.name().ends_with('/') {
        std::fs::create_dir_all(&outpath)?;
      } else {
        if let Some(p) = outpath.parent() {
            std::fs::create_dir_all(p)?;
        }
        let mut outfile = File::create(&outpath)?;
        std::io::copy(&mut file, &mut outfile)?;
      }
    }

    Ok::<_, anyhow::Error>(())
  })
  .await
  .map_err(|e| anyhow!(e))??;

  Ok(())
}

#[tauri::command]
pub fn fs_exists(path: String) -> bool {
  Path::new(&path).exists()
}

#[tauri::command]
pub async fn fs_rm_dir(path: String) -> TauriResult<()> {
  fs::remove_dir_all(path)
    .await
    .map_err(|e| anyhow!(e))?;

  Ok(())
}

// Operations with OS

pub(crate) struct OsInfo {
  pub os: String,
  pub version: String
}

pub(crate) fn get_info() -> OsInfo {
  OsInfo {
    os: sysinfo::System::name().unwrap_or_else(|| "unknown".to_string()),
    version: sysinfo::System::long_os_version().unwrap_or_else(|| "unknown".to_string())
  }
}

#[tauri::command]
pub fn env(variable: String) -> TauriResult<String> {
  Ok(var(variable).map_err(|e| anyhow!(e))?)
}