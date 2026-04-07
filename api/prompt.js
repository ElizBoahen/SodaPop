export default async function handler(req, res) {
	const { prompt } = req.body; // prompt input

	/*-- Calling AI --*/
	const hugResponse = await fetch(
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
	const hugData = await hugResponse.json(); // AI rsponse -> JSON
	const sodaText = hugData[0].generated_text;
	res.status(200).json({response:hfText}); // Back to Front-end
}