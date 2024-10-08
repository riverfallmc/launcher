# Лаунчер SerenityMC
Написан на базе технологии [Tauri](https://tauri.app/).

# Сборка
Вы должны иметь rustc и cargo на host машине.\
Они устанавливаются автоматически, при установке [Rust](https://rust-lang.org/).\
Также установите [Bun.sh](https://bun.sh/)
```bash
bun install
bun run tauri dev
```

# Логирование
Для того, чтобы лаунчер выдавал вам логи в консоль,\
вам нужно установить переменную окружения ``RUST_LOG`` в значение ``debug``.\
Вот как это делается на Linux:
```bash
export RUST_LOG=debug
```