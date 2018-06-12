import { Component } from 'react';
// import { gql, graphql } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import App from '../components/App';
import Page from '../components/Page';

import { initStore } from '../store';
import withApollo from '../lib/withApollo';

class AboutPage extends Component {
	render() {
		return (
			<App url={this.props.url}>
				{() => (
					<Page title="About">
						<p>
							Data Explorer is an interactive platform for visualising global
							public data. Using this tool, journalists and researchers can
							explore vast datasets from the Australian Bureau of Statistics,
							UNESCO, UK Data Service and the European Union, finding hidden
							trends that aren’t apparent when looking at the raw numbers.
						</p>

						<p>
							Data Explorer was one of five projects chosen to receive funding
							from the Walkley Media Incubator and Innovation Fund in 2017. The
							project was awarded the Innovation in Data prize, with funding of
							$10,000 sponsored by iSentia. Funding will go towards website
							hosting, UX research, design and development.
						</p>

						<p>
							This project is lead by Kaho Cheung, a full stack developer with a
							deep interest in data and interaction design. He works part-time
							on Data Explorer while working his day job as a developer for the
							State Library of NSW’s DX Lab team.
						</p>

						<p>
							Data Explorer’s aim is to make public data as accessible as
							possible. For journalists and researchers, this means less data
							wrangling and instant chart building. For the public, the datasets
							are presented in an approachable way - you don't have to be an
							expert to understand the data. Our broad goal is to demystify the
							data and improve data literacy over time.
						</p>

						<p>
							Data Explorer is currently under active development. We will be
							posting updates, asking for feedback and conducting beta testing
							from our Twitter account - @dataexplorerco.
						</p>

						<h2>Technology</h2>
						<p>
							At the heart of Data Explorer is the SDMX REST API standard used
							by several international statistical organisations. Due to this
							common format, Data Explorer is able to easily tap into data (and
							metadata) from the following organisations:
						</p>

						<ul>
							<li>Australian Bureau of Statistics</li>
							<li>OECD</li>
							<li>UKDS</li>
							<li>UNESCO</li>
						</ul>

						<p>
							In terms of the Data Explorer application, we are using Node.js to
							serve an isomorphic (aka universal) Javascript application, using
							React and Next.js.
						</p>

						<p>
							The charts are built using a React library called Victory. For
							hosting, we are using Zeit’s Now service.
						</p>

						<p>
							Our whole stack is almost all open source. We plan on releasing
							parts of the Data Explorer platform as open source too.
						</p>
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
