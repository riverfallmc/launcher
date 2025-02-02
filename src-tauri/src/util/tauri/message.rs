#![allow(unused)]

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct Message<T: Serialize + Clone> {
  r#type: String,
  body: T
}