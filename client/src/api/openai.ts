const OPENAI_API_URL = import.meta.env.VITE_APP_OPENAI_API_URL;
const OPENAI_API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY; // Ensure this is correctly set

export async function generateText(question: string): Promise<string | null> {
    try {
        const prompt = `Q: ${question}\nA: `;

        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 100, // Increase max tokens for more extensive answers
                temperature: 0.7, // A balance between creativity and coherence
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6, // To encourage more engaging and "present" responses
                stop: ["\n", " Q:", " A:"] // Stop sequences to clearly delineate the end of a response
            }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].text) {
            return data.choices[0].text.trim();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error generating text with OpenAI:", error);
        return null;
    }
}
