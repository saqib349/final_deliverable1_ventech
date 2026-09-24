import { GoogleGenAI } from "@google/genai";

export async function generateTodoFromPrompt(prompt) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!apiKey && !openAiKey) {
        throw new Error("AI API key is not configured in environment variables.");
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[new Date().getDay()];

    const systemInstruction = `You are an AI Todo Assistant.
Your task is to convert the user's natural language input into a structured JSON object representing a Todo item.
Today's reference date is ${todayStr} (${dayOfWeek}). Use this reference date to accurately calculate any relative date expressions like "tomorrow", "next Monday", "this Friday", "in 3 days", etc.

Your output MUST be a valid JSON object matching the exact structure below:
{
  "title": "Concise summary title of the todo item",
  "description": "Detailed description or notes about the task",
  "priority": "low" | "medium" | "high",
  "dueDate": "YYYY-MM-DD" | null,
  "completed": false
}

Rules:
1. Return ONLY pure valid JSON without markdown formatting or introductory text.
2. priority must ONLY be "low", "medium", or "high". If urgency is expressed ("very important", "urgent"), use "high".
3. dueDate must be a valid date in "YYYY-MM-DD" format if a date is mentioned or reasonably implied. If no due date is provided or implied, set dueDate to null. Do NOT invent a random date.
4. completed must always be false.
5. Do NOT include userId, _id, createdAt, updatedAt or authentication details.`;

    if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json"
                }
            });

            return response.text;

        } catch (err) {
            console.error("Gemini API Error:", err);
            throw err;
        }
    } else if (openAiKey) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });
        if (!res.ok) {
            throw new Error(`OpenAI API error status ${res.status}`);
        }
        const data = await res.json();
        return data.choices[0].message.content;
    }
}
