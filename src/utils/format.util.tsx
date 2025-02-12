export function formatBalance(balance: number): string {
  const cases = ["гем", "гема", "гемов"];
  const mod10 = balance % 10;
  const mod100 = balance % 100;

  const caseIndex =
    mod100 >= 11 && mod100 <= 14 ? 2 :
      mod10 === 1 ? 0 :
        mod10 >= 2 && mod10 <= 4 ? 1 :
          2;

  return `${balance} ${cases[caseIndex]}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 900 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)) | 0}Mb`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}Gb`;
}
