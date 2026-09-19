const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/analyze", async (req, res) => {
    try {
        const symptoms = req.body.symptoms;

        if (!symptoms) {
            return res.status(400).json({
                error: "Please enter your symptoms."
            });
        }

        const prompt = `
You are MediSense, an AI health information assistant.

Analyze the user's symptoms carefully.

User symptoms:
${symptoms}

Return a helpful health assessment with:

1. Possible conditions (2-3 possibilities)
2. Why each condition may match
3. What information is missing
4. General self-care advice
5. Warning signs / when to seek medical help
6. Urgency level: Low, Moderate, or High

Important:
- Do NOT claim to give a confirmed medical diagnosis.
- Do NOT say the condition is 100% certain.
- Consider the symptoms together rather than giving generic advice.
- If symptoms suggest an emergency, clearly tell the user to seek urgent medical care.
- Keep the answer easy for a normal person to understand.

Return the answer in clear JSON with these fields:

{
  "possibleConditions": [
    {
      "name": "",
      "likelihood": "",
      "reason": ""
    }
  ],
  "missingInformation": [],
  "selfCare": [],
  "warningSigns": [],
  "urgency": ""
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        let resultText = response.text;

        resultText = resultText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const result = JSON.parse(resultText);

        res.json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to analyze symptoms right now."
        });
    }
});

app.listen(PORT, () => {
    console.log(`MediSense is running at http://localhost:${PORT}`);
});