function ChatHistory({ history, onClearChat }) {
	if (!history.length) return null;

	return (
		<div className="history-container">
			<div className="history-header">
				<h2>Past bubbles</h2>
				<button
					type="button"
					className="clear-chat-btn"
					onClick={onClearChat}
				>
					Clear History🗑
				</button>
			</div>
			<ul className="chat-history">
				{history.map((item) => (
					<li key={item.id} className="history-item">
						<div className="history-prompt">{item.prompt}</div>
						<div className="history-response">{item.response}</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default ChatHistory;
