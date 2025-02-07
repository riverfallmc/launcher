use anyhow::{anyhow, Context};
use std::{fs::File, path::Path};
use tauri::{Emitter, Window};
use zip::ZipArchive;

fn unzip_cmd(window: Window, name: String, path: String) -> anyhow::Result<()> {
    let file = File::open(&path)?;
    let unpack_dir = Path::new(&path)
        .parent()
        .context(anyhow!("unable to get parent directory #1"))?;

    let mut archive = ZipArchive::new(file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let outpath = Path::new(unpack_dir).join(file.name());

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

    window.emit("dwninstalled", name)?;

    Ok(())
}

#[tauri::command]
pub fn unzip(window: Window, name: String, path: String) -> Result<(), String> {
    unzip_cmd(window, name, path).map_err(|e| e.to_string())
}
