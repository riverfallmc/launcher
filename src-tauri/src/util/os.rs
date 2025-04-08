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