use std::{io::{BufRead, BufReader}, process::{Child, Output}};

#[allow(unused)]
pub(crate) trait ProcessTrait {
  fn read_stderr(&mut self) -> anyhow::Result<&mut Self>;
  fn read_stdout(&mut self) -> anyhow::Result<String>;
}

impl ProcessTrait for Child {
  fn read_stderr(&mut self) -> anyhow::Result<&mut Self> {
    let mut buffer: Vec<String> = Vec::new();

    if let Some(stderr) = self.stderr.take() {
      let reader = BufReader::new(stderr);

      reader.lines()
        .for_each(|message| buffer.push(message.unwrap()));
    }

    if !buffer.is_empty() {
      return Err(anyhow::anyhow!("An error occurred during the execution of the process:".to_owned() + &buffer.join("\n")));
    }

    Ok(self)
  }

  fn read_stdout(&mut self) -> anyhow::Result<String> {
    let mut buffer: Vec<String> = Vec::new();

    if let Some(stdout) = self.stdout.take() {
      let reader = BufReader::new(stdout);

      reader.lines()
        .for_each(|message| {
          let msg = message.unwrap();
          buffer.push(msg.clone());
          println!("{msg}");
        });
    }

    Ok(buffer
        .join("\n"))
  }
}

pub struct OutputReader(Output);

impl From<Output> for OutputReader {
  fn from(output: Output) -> Self {
    OutputReader(output)
  }
}

impl ToString for OutputReader {
  fn to_string(&self) -> String {
    let stdout = String::from_utf8_lossy(&self.0.stdout);

    let first_line = stdout
      .lines()
      .next()
      .unwrap_or("");

    first_line.to_string()
  }
}
