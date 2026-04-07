import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json(); // Allows JSON bodies in Post request

app.post("/api/primpt", async(req, res) => {
	// Get inputed prompt text
	const {sodaPrompt} = req.body;

	// Call HuggingFace API
	const hugResponse = await fetch (
		"https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.HUG_KEY}` // PRIVATE KEY
			},
			body: JSON.stringify({
				inputs: prompt,
				parameters: {
					max_new_tokens: 150,
					temperature: 0.7
				}
			})
		}
	);

	// HuggingFace response -> JSON
	const hugData = await hugResponse.json();

	// JSON -> Text
	const sodaText = hugData[0].gen_text;

	// Text -> Front-end
	res.json({ response: sodaText });
};

/*-- start backend server --*/
app.listen(3000, () => {
	console.log("Backend running at http://localhost:3000");
});