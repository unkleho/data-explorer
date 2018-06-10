import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<link rel="stylesheet" href="/_next/static/style.css" />
					{/* <link rel="stylesheet" href="//basehold.it/18" /> */}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
