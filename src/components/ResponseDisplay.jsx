import { useEffect, useRef } from "react";

function ResponseDisplay({ prompt, response, loading, error }) {
	const containerRef = useRef(null);

	const chunks = response
		? response
			.replace(/\r\n/g, "\n")         // Normalize Windows line breaks
			.replace(/\n{3,}/g, "\n\n")     // Collapse 3+ newlines into 2
			.split(/\n\s*\n/)               // Split on blank lines
			.map((c) => c.trim())           // Remove stray whitespace
			.filter((c) => c.length > 0)    // Remove empty chunks
			/*.split(/\n\s*\n/).filter((c) => c.trim().length > 0)*/
		: [];
	// Auto-scroll with each response, like current web based
	useEffect(() => {
		if (containerRef.current) {
		  containerRef.current.scrollTo({
			top: containerRef.current.scrollHeight,
			behavior: "smooth",
		  });
		}
	  }, [chunks, loading]);
	return (
		<div className="response-container">
			{loading && <p className="loading-text">Carbonating your ideas . . .</p>}
			{error && <p className="error-text">{error}</p>}

			{prompt && !loading && !error && (
				<div className="bubble bubble-user">
						<p>{prompt}</p>
				</div>
			)}

			{!loading && !error && chunks.map((chunk, i) => (
				<div key={i} className="bubble bubble-ai response-chunk">
					<p>{chunk}</p>
				</div>
			))}
		</div>
	);
}

export default ResponseDisplay;