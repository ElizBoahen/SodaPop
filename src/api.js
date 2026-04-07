export async function sendPrompt(sodaPrompt) {
	const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
	{
		method: "POST",
		headers: {"Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_HUG_KEY}`},
		body: JSON.stringify({
			inputs: sodaPrompt,
			parameters: {
				max_new_tokens: 150,
				temperature: 0.7
			}
		}),
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


/*
export async function sendPrompt(sodaPrompt) {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_HUG_KEY}`
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

  const data = await res.json();
  return data[0].generated_text;
}
*/