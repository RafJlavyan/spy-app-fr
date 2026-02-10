export async function getAIHint(secretWord: string): Promise<string> {
  try {
    const response = await fetch(
      "https://site--spy-game-be--qm97qxrrfmwg.code.run/api/hint",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: secretWord }),
      },
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("AI response:", data); // { hint: "Связано с Францией" }

    return data.hint; // <== исправлено
  } catch (error) {
    console.error("Failed to fetch AI hint from server:", error);
    // fallback на первую букву
    return `Первая буква: ${secretWord[0]}`;
  }
}
