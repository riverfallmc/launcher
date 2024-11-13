/// Модуль который отвечает за все
/// что связано с джавой
///
/// 1. Ищет путь до установленной Java
/// 2. Проверяет версию Java

use core::str;
use std::{env, path::{Path, PathBuf}, process::Command, str::Split};
use anyhow::Context;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Java {
  path: PathBuf
}

#[allow(unused)]
impl Java {
  pub fn new() -> anyhow::Result<Java> {
    // let java = Java::find_one()?;
    let java = "/home/smokingplaya/.tlauncher/mojang_jre/java-runtime-alpha/linux/java-runtime-alpha/bin/java".to_string();

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

  fn get_major_version(
    version: &mut Split<'_, char>
  ) -> anyhow::Result<u8> {
    let current = version.next()
      .context("Couldn't get the version out")?;

    // Версии с 1.0 - 1.9
    // Версия 1.1 не будет так воркать.
    // Ну блять, я не собираюсь 1.1 использовать
    if (current == "1") {
      return Self::get_major_version(version);
    }

    Ok(current.parse::<u8>()?)
  }

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

    let mut version = version_line
      .split_whitespace()
      .find(|s| s.starts_with('"'))
      .context("Failed to parse version number")?
      .trim_matches('"')
      .split('.');

    Self::get_major_version(&mut version)
  }

  pub fn start(&self) -> Command {
    Command::new(self.path.clone())
  }

  /// Ищет Java в переменных среды а так же через команды ``where/which``
  fn find_one() -> anyhow::Result<String> {
    let java_name = if cfg!(target_os = "windows") {"javaw.exe"} else {"java"};

    if let Ok(java_home) = env::var("JAVA_HOME") {
      return Ok(Path::new(&java_home).join(java_name).to_str().unwrap().to_string());
    }

    let cmd = if cfg!(target_os = "windows") {"where"} else {"which"};
    let output = Command::new(
      if cfg!(target_os = "windows") {"where"} else {"which"}
    ).arg(java_name).output()?;

    let path = String::from_utf8_lossy(&output.stdout);
    let first_line = path.lines().next().unwrap_or("");
    Ok(first_line.to_string())
  }
}