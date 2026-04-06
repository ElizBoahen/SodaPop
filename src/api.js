export async function sendPrompt(prompt) {
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
		}),
	});

	if (!res.ok) {
		const error = new Error("API error");
		error.status = res.status;
		throw error;
	}

	const data = await res.json();
	return data.choices[0].message.content;
}