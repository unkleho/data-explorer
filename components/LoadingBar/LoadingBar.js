import './LoadingBar.css';

const LoadingBar = ({ isLoading }) => {
	return isLoading ? (
		<div className="loading-bar">
			<div className="loading-bar__bar" />
			<div className="loading-bar__bar" />
			<div className="loading-bar__bar" />
		</div>
	) : null;
};

export default LoadingBar;
