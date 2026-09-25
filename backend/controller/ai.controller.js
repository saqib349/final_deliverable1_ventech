import { generateTodoFromPrompt } from "../services/ai.service.js";

export async function generateTodo(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                message: "Prompt is required and must be a non-empty string"
            });
        }

        let rawResponse;
        try {
            rawResponse = await generateTodoFromPrompt(prompt.trim());
        } catch (err) {
            console.error("AI Service Error:", err.message);
            return res.status(500).json({
                message: "Failed to generate todo from AI service. Please check AI API configuration."
            });
        }

        let parsed;
        try {
            let cleanResponse = rawResponse.trim();
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
            }
            parsed = JSON.parse(cleanResponse);
        } catch (err) {
            console.error("JSON Parse Error:", err.message, "Raw response:", rawResponse);
            return res.status(500).json({
                message: "AI returned an invalid structured output. Please try again with a clearer prompt."
            });
        }

        let title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : prompt.trim();

        let description = typeof parsed.description === "string" ? parsed.description.trim() : "";

        let priority = "medium";
        if (typeof parsed.priority === "string") {
            const lowerPriority = parsed.priority.toLowerCase().trim();
            if (["low", "medium", "high"].includes(lowerPriority)) {
                priority = lowerPriority;
            }
        }

        let completed = typeof parsed.completed === "boolean" ? parsed.completed : false;

        let dueDate = null;
        if (parsed.dueDate && parsed.dueDate !== "null" && typeof parsed.dueDate === "string") {
            const parsedDate = new Date(parsed.dueDate);
            if (!isNaN(parsedDate.getTime())) {
                dueDate = parsedDate.toISOString().split("T")[0];
            }
        }

        const structuredTodo = {
            title,
            description,
            priority,
            dueDate,
            completed
        };

        return res.status(200).json({
            data: structuredTodo
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "An unexpected error occurred during AI todo generation"
        });
    }
}
