import { Component } from 'react';
import PropTypes from 'prop-types';

import './ShareBox.css';

class ShareBox extends Component {
	static propTypes = {
		// url: PropTypes.string.isRequired,
		// pathname: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		text: PropTypes.string,
		imageUrl: PropTypes.string,
		className: PropTypes.string,
	};

	static defaultProps = {
		text: 'Check out this chart from',
	};

	render() {
		const { title, text, imageUrl, className } = this.props;
		const tweetText = encodeURIComponent(`${text} @dataexplorerio`);
		const fbAppId = process.env.FB_APP_ID;
		const url = encodeURIComponent(window.location.href);

		if (title === undefined) {
			return null;
		}

		// TODO: Use baseUrl variable
		// const url = encodeURIComponent(`http://dxlab.sl.nsw.gov.au${pathname}`);
		const fbLink = `https://www.facebook.com/dialog/share?app_id=${fbAppId}&href=${url}&redirect_uri=${url}&name=%${encodeURIComponent(
			title,
		)}&description=${encodeURIComponent(text)}${
			imageUrl ? `&picture=${imageUrl}` : ''
		}`;

		const twitterLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`;

		return (
			<div className={`share-box ${className ? className : ''}`}>
				<div className="share-box__title">Share</div>

				<div className="share-box__icons">
					<a
						href={twitterLink}
						aria-label="Share this post on Twitter"
						target="_blank"
					>
						<span
							className="share-box__icon share-box__icon--twitter"
							aria-hidden="true"
						/>
					</a>

					{fbAppId && (
						<a
							href={fbLink}
							aria-label="Share this post on Facebook"
							target="_blank"
						>
							<span
								className="share-box__icon share-box__icon--facebook"
								aria-hidden="true"
							/>
						</a>
					)}
				</div>
			</div>
		);
	}
}

export default ShareBox;
