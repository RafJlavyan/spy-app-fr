const MAX_RECENT = 100;

function getRecentWords(): string[] {
  const saved = localStorage.getItem("recentWords");
  return saved ? JSON.parse(saved) : [];
}

function addRecentWord(word: string): void {
  const recent = getRecentWords();
  if (!recent.includes(word)) {
    recent.push(word);
    if (recent.length > MAX_RECENT) {
      recent.shift(); // remove the oldest
    }
    localStorage.setItem("recentWords", JSON.stringify(recent));
  }
}

/**
 * Returns a unique secret word from the provided list, not recently used.
 * Adds the chosen word to the recent words list.
 * If all words have been used recently, returns a random word.
 */
export function getUniqueSecretWord(words: string[]): string {
  const recent = getRecentWords();
  const availableWords = words.filter((word) => !recent.includes(word));
  const chosenWord =
    availableWords.length > 0
      ? availableWords[Math.floor(Math.random() * availableWords.length)]
      : words[Math.floor(Math.random() * words.length)];
  addRecentWord(chosenWord);
  return chosenWord;
}
