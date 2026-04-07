export async function sendPrompt(sodaPrompt) {
	const hugResponse = await fetch("https://router.huggingface.co/v1/chat/completions",
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest",
			Authorization: `Bearer ${import.meta.env.VITE_HUG_KEY}`},
		body: JSON.stringify({
			inputs: sodaPrompt,
			parameters: {
				max_new_tokens: 200,
				temperature: 0.8 // -> More creative
			}
		}),
	});

	/*-- In Case of Erors --*/
	if (!hugResponse.ok) {
		/*const error = new Error("API error");
		error.status = hugResponse.status;
		throw error;*/
		const errorBody = await hugResponse.text();
		console.error("HF ERROR STATUS:", hugResponse.status);
		console.error("HF ERROR BODY:", errorBody);

		const error = new Error(`API error ${hugResponse.status}`);
		error.status = hugResponse.status;
		error.body = errorBody;
		throw error;
		}

		// JSON -> JS
		const hugData = await hugResponse.json();
		return hugData[0].generated_text;
}