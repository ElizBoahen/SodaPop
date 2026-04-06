function ResponseDisplay({ prompt, response, loading, error }) {
	const chunks = response
		? response.split(/\n\s*\n/).filter((c) => c.trim().length > 0)
		: [];

	return (
		<div className="response-container">
			{loading && <p className="loading-text">Carbonating your ideas . . .</p>}
			{error && <p className="error-text">{error}</p>}

			{prompt && !loading && !error && (
				<div className="bubble bubble-user">
						<p>{prompt}</p>
				</div>
			)}

			{!loading &&
				!error &&
				chunks.map((chunk, i) => (
				<div key={i} className="bubble bubble-ai response-chunk">
					<p>{chunk}</p>
				</div>
			))}
		</div>
	);
}

export default ResponseDisplay;