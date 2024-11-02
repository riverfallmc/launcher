use std::{fs::File, path::Path};

use zip::ZipArchive;

#[allow(unused)]
pub(crate) fn unpack_rar(path: &str, unpack_dir: &str) -> anyhow::Result<()> {
  let file = File::open(path)?;
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

  Ok(())
}