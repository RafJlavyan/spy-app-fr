/**
 * Handles Armenian special characters like "ու" as a single unit.
 */
function getLetters(word: string): string[] {
  const letters: string[] = [];
  let i = 0;
  while (i < word.length) {
    if (word[i] === "ո" && word[i + 1] === "ւ") {
      letters.push("ու");
      i += 2;
    } else {
      letters.push(word[i]);
      i++;
    }
  }
  return letters;
}

export type HintType =
  | "Underlined"
  | "FirstLast"
  | "FirstLetter"
  | "PartOfWord"
  | "RandomMasked";

export function generateHint(word: string, type: HintType): string {
  const words = word.split(" ");

  const processedWords = words.map((w) => {
    const letters = getLetters(w);
    if (letters.length === 0) return "";

    switch (type) {
      case "Underlined": {
        // L----- form: First letter + remaining as underscores
        return letters[0] + "-".repeat(letters.length - 1);
      }
      case "FirstLast": {
        // L---t form: First and last letter
        if (letters.length <= 2) return w;
        return (
          letters[0] +
          "-".repeat(letters.length - 2) +
          letters[letters.length - 1]
        );
      }
      case "FirstLetter": {
        return letters[0];
      }
      case "PartOfWord": {
        // Show a random 2-letter part
        if (letters.length <= 2) return w;
        const start = Math.floor(Math.random() * (letters.length - 1));
        return letters.slice(start, start + 2).join("");
      }
      case "RandomMasked": {
        // 1-2 letters visible, others underlined (e.g., L----- -s--)
        if (letters.length <= 2) return w;
        const visibleIndices = new Set([0]); // Always show first
        if (letters.length > 4) {
          visibleIndices.add(
            Math.floor(Math.random() * (letters.length - 1)) + 1,
          );
        }

        return letters
          .map((char, idx) => (visibleIndices.has(idx) ? char : "-"))
          .join("");
      }
      default:
        return letters[0];
    }
  });

  return processedWords.join(" ");
}
