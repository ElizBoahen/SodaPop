import { useState, useEffect } from "react";
import PromptInput from "./components/PromptInput";
import ResponseDisplay from "./components/ResponseDisplay";
import ChatHistory from "./components/ChatHistory";
import "./index.css";

function App() {
	const [currentResponse, setCurrentResponse] = useState("");
	const [currentPrompt, setCurrentPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [history, setHistory] = useState([]);

	const [hasInteracted, setHasInteracted] = useState(false); // trigger for actions after input

	useEffect(() => {
		const saved = localStorage.getItem("sodapop-history");
		if (saved) setHistory(JSON.parse(saved));
	}, []);

	useEffect(() => {
		localStorage.setItem("sodapop-history", JSON.stringify(history));
	}, [history]);

	const handleNewExchange = (prompt, response) => {
		const entry = { id: Date.now(), prompt, response };
		setHistory((prev) => [entry, ...prev]);
		setCurrentPrompt(prompt);
		setCurrentResponse(response);
	};

	const handleClearChat = () => {
		setHistory([]);
		setCurrentPrompt("");
		setCurrentResponse("");
		localStorage.removeItem("sodapop-history");
	};

	return (
		<>
		<div className="app-header">
			<h1>SodaPop</h1>
			<h2 className={`tagline ${hasInteracted ? "hidden" : ""}`}>For the ideas that pop up.</h2>
		</div>

		<div className="app-shell">
	        {!hasInteracted && (
				<div className="app-instructions">
					<p>When ideas pop in your mind, wirte them down before they fizzle away. SodaPop helps you ideate through your many ideas, all in one place.</p>
				</div>
			)}
			<section className="response-section">
				<ResponseDisplay
					prompt={currentPrompt}
					response={currentResponse}
					loading={loading}
					error={error}
				/>
				<ChatHistory history={history} onClearChat={handleClearChat} />
			</section>
			<main>
				<div className="stick-bottom">
					<section className="prompt-section">
						<PromptInput
							onResult={handleNewExchange}
							setLoading={setLoading}
							setError={setError}
							/* Changing UI to actively chating UI */
							onFirstSubmit={() => setHasInteracted(true)}
						/>
					</section>
				</div>
			</main>
		</div>
		</>
	);
}

export default App;