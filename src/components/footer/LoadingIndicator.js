import React, { PropTypes } from 'react';
import golem_loading from './../../assets/img/golem-loading.svg';

const LoadingIndicator = ({ isEngineLoading }) => {
	return (
		<div>
			<div
				className={`loading-indicator ${
					isEngineLoading ? 'active' : ''
				}`}
			/>
			{isEngineLoading && (
				<object
					className="loading-icon"
					type="image/svg+xml"
					data={golem_loading}
				/>
			)}
		</div>
	);
};

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
