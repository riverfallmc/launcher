/// Модуль который отвечает за все
/// что связано с джавой

use core::str;
use std::{env, path::{Path, PathBuf}, process::Command};
use anyhow::Context;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Java {
  path: PathBuf
}

#[allow(unused)]
impl Java {
  pub fn new() -> anyhow::Result<Java> {
    let java = Java::find_one()?;

    if Command::new(&java).output().is_ok() {
      return Ok(Java {
        path: Path::new(&java).to_path_buf()
      });
    }

    Err(anyhow::anyhow!("Unable to find Java on your PC"))
  }

  pub fn get_path(&self) -> PathBuf {
    self.path.clone()
  }

  pub fn min_version(
    &self,
    min: u8
  ) -> anyhow::Result<()> {
    let version = self.get_version()?;

    // лол
    if min > version {
      return Err(anyhow::anyhow!("You need to upgrade Java to version {min}."));
    }

    Ok(())
  }

  // Вот тут начинается пиздец

  /// Возвращает версию найденной Java
  fn get_version(&self) -> anyhow::Result<u8> {
    let java = self.path
      .to_str()
      .context("Unable to get java path")?;

    let output = Command::new(java)
      .arg("-version")
      .output()
      .context("Failed to get java version")?;

    let output_str = String::from_utf8_lossy(&output.stderr);

    let version_line = output_str
      .lines()
      .next()
      .context("Failed to read output from java -version")?;

    let version_number = version_line
      .split_whitespace()
      .find(|s| s.starts_with('"'))
      .context("Failed to parse version number")?
      .trim_matches('"')
      .split('.')
      .next()
      .context("Failed to extract major version")?;

    version_number.parse::<u8>().context("Failed to convert version to u8")
  }

  pub fn start(&self) -> Command {
    Command::new(self.path.clone())
  }

  /// Ищет Java в переменных среды а так же через команды ``where/which``
  fn find_one() -> anyhow::Result<String> {
    if let Ok(java_home) = env::var("JAVA_HOME") {
      return Ok(java_home);
    }

    let cmd = if cfg!(target_os = "windows") {"where"} else {"which"};
    let output = Command::new(cmd).arg("java").output()?;

    let path = String::from_utf8_lossy(&output.stdout);
    let first_line = path.lines().next().unwrap_or("");
    Ok(first_line.to_string())
  }
}