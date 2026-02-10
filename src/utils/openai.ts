export async function getAIHint(
  secretWord: string,
  language: "am" | "en",
): Promise<string> {
  try {
    const response = await fetch(
      "https://site--spy-game-be--qm97qxrrfmwg.code.run/api/hint",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: secretWord,
          language,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("AI response:", data); // { hint: "e _ _ ph" }

    return data.hint;
  } catch (error) {
    console.error("Failed to fetch AI hint from server:", error);

    // 🔥 Smart fallback: random hint locally
    return secretWord.length <= 4 ? secretWord[0] : `${secretWord[0]} _ _`;
  }
}
