import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Back-end reading JSON from front-end. Allows JSON bodies in Post request
app.use(express.json());

app.post("/api/prompt", async(req, res) => {
	// Front-end -> Back-end. Get inputed prompt text
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
				inputs: sodaPrompt,
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
	const sodaText = hugData[0].generated_text;

	// Text -> Front-end
	res.json({ response: sodaText });
});

/*-- start backend server --*/
app.listen(3000, () => {
	console.log("Backend running at http://localhost:3000");
});