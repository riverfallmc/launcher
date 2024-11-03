#![allow(unused)]

use serde::{Serialize, Deserialize};
use super::emit;

const EMIT_EVENT_ID: &'static str = "message";

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct Message<T: Serialize + Clone> {
  r#type: String,
  body: T
}

pub(crate) async fn send<T: Serialize + Clone>(
  channel: Option<&str>,
  r#type: &str,
  body: T
) -> anyhow::Result<()> {
  let message = Message { r#type: r#type.to_string(), body };

  emit::<Message<T>>(channel.unwrap_or(EMIT_EVENT_ID), message).await;

  Ok(())
}