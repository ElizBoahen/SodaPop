export async function sendPrompt(prompt) {
	const res = await fetch("/api/prompt", { // No URL
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({prompt}),
	});

	/*-- In Case of Erors --*/
	if (!res.ok) {
		const error = new Error("API error");
		error.status = res.status;
		throw error;
	}

	// JSON -> JS
	const data = await res.json();
	return data.response;
}