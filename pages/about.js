import { Component } from 'react';
// import { gql, graphql } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import App from '../components/App';
import Page from '../components/Page';

import { initStore } from '../store';
import npmPackage from '../package.json';
// import withApollo from '../lib/withApollo';

class AboutPage extends Component {
	render() {
		return (
			<App url={this.props.url} title="About | Data Explorer">
				{() => (
					<Page title="About">
						<blockquote>
							We are building an interactive platform for visualising global
							public data.
						</blockquote>
						<p>
							By using <strong>Data Explorer</strong>, journalists and
							researchers can explore vast datasets from the{' '}
							<a href="http://www.abs.gov.au/">
								Australian Bureau of Statistics
							</a>, <a href="http://uis.unesco.org/">UNESCO</a>,{' '}
							<a href="https://www.ukdataservice.ac.uk/">UK Data Service</a> and
							the <a href="http://stats.oecd.org/">OECD</a>, finding hidden
							trends that aren’t apparent when looking at the raw numbers.
						</p>
						<p>
							Data Explorer was one of five projects chosen to receive funding
							from the{' '}
							<a href="https://medium.com/the-walkley-magazine/what-the-five-2017-walkley-innovation-grantees-are-up-to-abae28ff311f">
								Walkley Media Incubator and Innovation Fund in 2017
							</a>. The project was awarded the{' '}
							<strong>Innovation in Data</strong> prize, with funding of $10,000
							sponsored by <a href="https://www.isentia.com/">iSentia</a>.
							Funding will go towards website hosting, UX research, design and
							development.
						</p>
						<p>
							This project is lead by{' '}
							<a href="https://twitter.com/unkleho">Kaho Cheung</a>, a developer
							with a deep interest in data and interaction design. He works
							part-time on Data Explorer while working his day job as the Tech
							Lead for the State Library of NSW’s{' '}
							<a href="https://dxlab.sl.nsw.gov.au">DX Lab</a> innovation team.
						</p>
						<blockquote>
							Our aim is to make public data as accessible as possible.{' '}
						</blockquote>
						<p>
							For journalists and researchers, this means less data wrangling
							and instant chart building. For the public, the datasets are
							presented in an approachable way - you don't have to be an expert
							to understand the data. Our broad goal is to demystify the data
							and improve data literacy over time.
						</p>
						<p>
							Data Explorer is currently under active development. We will be
							posting updates, asking for feedback and conducting beta testing
							from our Twitter account -{' '}
							<a href="https://twitter.com/dataexplorerio">@dataexplorerio</a>.
						</p>
						<h2>Technology</h2>
						<p>
							At the heart of Data Explorer is the{' '}
							<a href="https://sdmx.org/">SDMX REST API</a> standard used by
							several international statistical organisations. Due to this
							common format, Data Explorer is able to tap into data from the
							following organisations:
						</p>
						<ul>
							<li>
								<a href="http://www.abs.gov.au">ABS</a>
							</li>
							<li>
								<a href="http://www.oecd.org">OECD</a>
							</li>
							<li>
								<a href="https://www.ukdataservice.ac.uk/">UKDS</a>
							</li>
							<li>
								<a href="https://en.unesco.org/">UNESCO</a>
							</li>
						</ul>
						<p>
							For the Data Explorer application, we are using Node.js to serve
							an isomorphic (aka universal) Javascript application, using{' '}
							<a href="https://reactjs.org">React</a> and{' '}
							<a href="https://github.com/zeit/next.js/">Next.js</a>.
						</p>
						<p>
							Sitting between this frontend application and the SDMX data is a
							powerful <a href="https://api.dataexplorer.co">GraphQL server</a>.
							While SDMX data requests are live, we do store some data using{' '}
							<a href="https://prisma.sh">Prisma's</a> GraphQL service.
						</p>
						<p>
							The charts are built using a React library called{' '}
							<a href="https://github.com/FormidableLabs/victory">Victory</a>.
							For hosting, we are using <a href="https://zeit.co/">Zeit’s</a>{' '}
							serverless service.
						</p>
						<p>
							Our whole stack is almost all open source. We plan on releasing
							parts of the Data Explorer platform as open source too.
						</p>
						<p>{npmPackage.version}</p>
					</Page>
				)}
			</App>
		);
	}
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (ExamplePage)
// export default withApollo(
// 	graphql(allObjects, {
// 		props: ({ data }) => {
// 			console.log('about');
// 			console.log(data);
//
// 			return {
// 				...data,
// 			};
// 		},
// 	})(AboutPage),
// );

export default withRedux(initStore)(AboutPage);
