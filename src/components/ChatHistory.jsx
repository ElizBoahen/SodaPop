function ChatHistory({ history, onClearChat, onClose }) {
	// if (!history.length) return null;

	return (
		<div className="history-overlay">
			<div className="history-bubble">
				<button className="history-close-btn" onClick={onClose}>
					X
				</button>
					<h2><center>Past Bubbles</center></h2>
				<div className="history-content">	
					<div className="chat-history">
						{history.length === 0 && (
							<p className="history-empty">No bubbles yet!</p> // No history
						)}

						{history.map((item) => (
							<li key={item.id} className="history-item">
								<div className="history-prompt">{item.prompt}</div>
								<div className="history-response">{item.response}</div>
							</li>
						))}
					</div>
					{/*<button type="button" className="clear-history-btn" onClick={onClearChat}  disabled={!hasHistory}>
						<strong>Clear History 🗑</strong>
					</button>*/}
				</div>
					<button type="button" className="clear-history-btn" onClick={onClearChat} disabled={history.length === 0}> 
						<strong>Clear History 🗑</strong>
					</button>
			</div>
		</div>
	);
}

export default ChatHistory;

/*
<img src="" alt="" className="history-clear-icon" />
function ChatHistory({ history, onClearChat, onClose }) {
	if (!history.length) return null;

	return (
		<div className="history-container">
			<div className="history-header">
				<h2>Past bubbles</h2>
				<button type="button" className="clear-chat-btn" onClick={onClearChat}>
					Clear History 🗑
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


*/
