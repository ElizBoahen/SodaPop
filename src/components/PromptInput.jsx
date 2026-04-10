import { useState, useRef, useEffect } from "react";
import { sendPrompt } from "../api";

function PromptInput({ onResult, loading, setLoading, setError, onFirstSubmit, onOpenHistory, hasHistory }) {
	const [prompt, setPrompt] = useState("");
	const [warning, setWarning] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [uiError, setUiError] = useState("");
	const textareaRef = useRef(null);

	const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		const maxHeight = 80; // ~100 words visual limit
		el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
		el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
	}, [prompt]);

	/*-- Dynamic Input Box --*/
	const handleChange = (e) => {
		const value = e.target.value;
		const words = value.trim() ? value.trim().split(/\s+/).length : 0;

		setIsExpanded(value.length > 0);

		if (words > 180) {
			setWarning("Your bubble is going to burst! Please shorten your prompt. Don't worry, you can bring these ideas up later.");
		} else if (words > 100) {
			setWarning("We're getting close to the brim . . .");
		} else {
			setWarning("");
		}

		setPrompt(value);
	};

	/*-- Key Mapping --*/
	const handleKeyDown = (e) => {
		if (loading) {
			e.preventDefault(); //Specifically makes the button do nothing
			return; // Revents from submitting a prompt while loading
		}
		if (e.key === "Enter" && e.shiftKey) { // Shift+Enter for newline
			return;
		}

		if (e.key === "Enter") {// Enter to submit
			e.preventDefault(); // stop newline
			handleSubmit();
		}
	};

	/*-- After Submit --*/
	const handleSubmit = async () => {
		if (!prompt.trim()) {
			setUiError("Oops! That bubble is empty. Please enter your idea."); // In case empty
			return;
		}
		if (!prompt.trim())return;

		// Change landing UI to Actively chatting UI
		if (onFirstSubmit){
			onFirstSubmit();
		}

		setLoading(true);
		setError("");
		setWarning("");

		try {
			const response = await sendPrompt(prompt.trim());
			onResult(prompt.trim(), response);
		} catch (err) {
			let msg = err.message; console.error("API ERROR:", err); //"Something fizzle out. Please try again.";
			if (err.status === 401) msg = "Your bottle cap was loose . . . (401)."; /*auth error*/
			if (err.status === 403) msg = "This flavor is off-limits (403)."; /*auth error*/
			if (err.status === 429) msg = "Too many bubbles at once! Please slow your sip (429)."; /*auth error*/
			setError(msg);
		} finally {
			setLoading(false);
			setIsExpanded(false);
			setPrompt("");
		}
	};

	const handleClearPrompt = () => {
		setPrompt("");
		setWarning("");
	};

	return (
		<div className="prompt-container">
			<div className="prompt-header">
				<span className="prompt-label">What’s bubbling in your mind?</span>
			</div>

			<div className="prompt-wrapper">
				{/*<div className="prompt-box">*/}
					<textarea
					id="prompt-input" // Just in case
					ref={textareaRef}    // Auto-resize
					value={prompt}       // Input
					onChange={handleChange} //
					onKeyDown={handleKeyDown} // Key mapping
					placeholder="I was thinking . . ."
					className={`prompt-textarea ${warning ? "warning-border" : ""} ${isExpanded ? "expanded" : ""}`} // Warnings + Text area stretch
					/>
				{/*</div>*/}
				<div className="prompt-buttons">
					<button type="button" className="clear-prompt-btn" onMouseEnter={() => setAnimate(true)} onClick={handleClearPrompt}>
						<span className="clear-icon"> X </span>Clear
					</button>
					<button type="button" className="open-history-btn" onClick={() => onOpenHistory(true)}>
						📚 History
					</button>

					<button type="button" className="submit-btn" onClick={handleSubmit} disabled={loading || !prompt.trim() || wordCount > 180}>
						<span className="submit-icon">()</span>Submit
					</button>
				  </div>
			</div>

			<div className="prompt-meta">
				{wordCount >= 500 && (
					<span className="word-count">* {wordCount} words *</span>
				)}

				{warning && (
					<span className="warning-text">{warning}</span>
				)}
				{uiError && (
					<span className="ui-error">{uiError}</span>
				)}
			</div>

		</div>
	);
}

export default PromptInput;
