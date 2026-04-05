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
    <div className="app-shell">
      <header className="app-header">
        <h1>SodaPop</h1>
        <p className="tagline">Ideas that bubble to the surface.</p>
      </header>

      <main className="app-main">
        <section className="prompt-section">
          <PromptInput
            onResult={handleNewExchange}
            setLoading={setLoading}
            setError={setError}
          />
        </section>

        <section className="response-section">
          <ResponseDisplay
            prompt={currentPrompt}
            response={currentResponse}
            loading={loading}
            error={error}
          />
          <ChatHistory history={history} onClearChat={handleClearChat} />
        </section>
      </main>
    </div>
  );
}

export default App;
