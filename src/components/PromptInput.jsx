import { useState, useRef, useEffect } from "react";
import { sendPrompt } from "../api";

function PromptInput({ onResult, setLoading, setError }) {
  const [prompt, setPrompt] = useState("");
  const [warning, setWarning] = useState("");
  const textareaRef = useRef(null);

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 200; // ~250 words visual limit
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [prompt]);

  const handleChange = (e) => {
    const value = e.target.value;
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;

    if (words > 800) {
      setWarning("Max 800 words — your soda is overflowing!");
      return;
    } else if (words > 250) {
      setWarning("You’ve hit 250 words. We’ll scroll from here.");
    } else {
      setWarning("");
    }

    setPrompt(value);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setWarning("");

    try {
      const response = await sendPrompt(prompt.trim());
      onResult(prompt.trim(), response);
    } catch (err) {
      let msg = "Something fizzled. Please try again.";
      if (err.status === 401) msg = "Fizzy auth error — your soda cap might be loose (401).";
      if (err.status === 403) msg = "This flavor is off-limits (403).";
      if (err.status === 429) msg = "Too many bubbles at once — slow your sip (429).";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearPrompt = () => {
    setPrompt("");
    setWarning("");
  };

  return (
    <div className="prompt-container">
      <div className="prompt-header">
        <span className="prompt-label">Your prompt</span>
        <button
          type="button"
          className="clear-prompt-btn"
          onClick={handleClearPrompt}
        >
          Clear🗑
        </button>
      </div>

      <div className="prompt-box">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleChange}
          placeholder="Type what’s bubbling in your mind..."
          className={`prompt-textarea ${warning ? "warning-border" : ""}`}
        />
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!prompt.trim()}
        >
          <span className="submit-label">Submit</span>
          <span className="submit-icon">🧃</span>
        </button>
      </div>

      <div className="prompt-meta">
        <span>{wordCount} words</span>
        {warning && <span className="warning-text">{warning}</span>}
      </div>
    </div>
  );
}

export default PromptInput;
