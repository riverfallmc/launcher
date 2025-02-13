export function playSound(sound: string) {
  const audio = new Audio(sound);
  audio.play()
    .catch(e => console.error("Ошибка воспроизведения:", e));
}
