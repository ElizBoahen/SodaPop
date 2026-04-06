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
			setWarning("Your ideas are overflowing! Max 800 words please.");
			return;
		} else if (words > 600) {
			setWarning("We're getting close to the brim . . .");
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
			let msg = "Something fizzle out. Please try again.";
			if (err.status === 401) msg = "Your bottle cap was loose . . . (401)."; /*auth error*/
			if (err.status === 403) msg = "This flavor is off-limits (403)."; /*auth error*/
			if (err.status === 429) msg = "Too many bubbles at once! Please slow your sip (429)."; /*auth error*/
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
			<span className="prompt-label">What’s bubbling in your mind?</span>
				<button type="button" className="clear-prompt-btn" onClick={handleClearPrompt}>
					Clear X
				</button>
			</div>

			<div className="prompt-box">
				<textarea
				ref={textareaRef}
				value={prompt}
				onChange={handleChange}
				placeholder="I was thinking . . ."
				className={`prompt-textarea ${warning ? "warning-border" : ""}`}
				/>
				<button type="button" className="submit-btn" onClick={handleSubmit} disabled={!prompt.trim()}>
					<span className="submit-label">Submit</span>
					<span className="submit-icon">	E0C7</span>
				</button>
			</div>

			<div className="prompt-meta">
				{wordCount >= 500 && (
					<span className="word-count">/* {wordCount} words */</span>
				)}

				{warning && (
					<span className="warning-text">{warning}</span>
				)}
			</div>

		</div>
	);
}

export default PromptInput;
