#![allow(unused)]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct Message<T: Serialize + Clone> {
    r#type: String,
    body: T,
}
