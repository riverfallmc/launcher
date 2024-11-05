use std::path::PathBuf;

use anyhow::Context;

pub(crate) trait PathBufToString {
  fn to_string(&self) -> anyhow::Result<String>;
}

impl PathBufToString for PathBuf {
  fn to_string(&self) -> anyhow::Result<String> {
    Ok(self.to_str().context("Failed to cast PathBuf to String type")?.to_string())
  }
 }