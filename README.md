<p align="center">
  <img src="https://avatars.githubusercontent.com/u/184562985?s=200&v=4" alt="Riverfall Logo">
</p>

<h1 align="center">Лаунчер</h1>

<!-- <h3 align="center">
<div align="center">
  <img src="https://img.shields.io/github/release/riverfall/launcher.svg">
  <img src="https://img.shields.io/github/license/riverfall/launcher.svg">
  <img src="https://img.shields.io/github/issues/riverfall/launcher.svg">
</div>
</h3> -->

# Содержание
* Использование
  * [Режим разработки](#режим-разработки)
  * [Сборка в production](#production)


# Использование
## Режим разработки
### Настройка зависимостей
1. Установите [bun](https://bun.sh) и [cargo](https://rust-lang.org)
2. Установите [puff](https://github.com/smokingplaya/puff)
3.  ```bash
    bun install
    cd src-tauri && cargo build
    ```
### Запуск
```bash
puff
```

# Production
Для этого уже есть настроенный [workflow](./.github/workflows/build.yml).\
Достаточно сделать тэг с форматом `v*.*.*`, например `v1.0.0`,\
после чего Action собирающий `NSIS`, `AppImage`, `.deb`, `.rpm`\
будет запущен.\
После успешной сборки, артефакты (собранные установщики) будут автоматически\
выложены к этому тэгу.