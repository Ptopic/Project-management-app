import React from 'react';

function Notification({ text, type }) {
	const backgroundColor =
		type === 'error' ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 255, 0, 0.7)';
	return (
		<div className="notification-container">
			<div
				className="notification"
				style={{ backgroundColor: backgroundColor }}
			>
				<p>{text}</p>
			</div>
		</div>
	);
}

export default Notification;
