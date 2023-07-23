import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../index.css';
import './ErrorPage.css';

function ErrorPage() {
	const error = useRouteError();
	console.error(error);
	return (
		<div id="error-page">
			<div className="glitch-wrapper">
				<div className="glitch">404</div>

				<h2 className="glitch h2">Oops! Page not found</h2>
				<p>The page you're looking for does not exist.</p>
				<button>
					<Link to={`/`} className="home">
						Home
					</Link>
				</button>
			</div>
		</div>
	);
}

export default ErrorPage;
