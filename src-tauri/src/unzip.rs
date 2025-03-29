use anyhow::{anyhow, Context};
use std::{fs::File, path::Path, sync::Arc};
use tokio::task;
use zip::ZipArchive;

use crate::util::tauri::AnyhowResult;

#[tauri::command]
pub async fn unzip(path: String) -> AnyhowResult<()> {
  let path = Arc::new(path);
  let unpack_dir = Path::new(&*path)
    .parent()
    .context(anyhow!("unable to get parent directory #1"))?
    .to_path_buf();

  let path_clone = Arc::clone(&path);

  task::spawn_blocking(move || {
    let file = File::open(&*path_clone)?;
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
  }).await
    .map_err(|e| anyhow!(e))??; // лол

  Ok(())
}
