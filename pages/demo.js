import { Component } from 'react';
import Link from 'next/link';
import { gql, graphql } from 'react-apollo';

import App from '../components/App';
import withData from '../lib/withData';
// import { buildDataSets } from '../utils';
// import { allData } from '../data';

// const dataSets = buildDataSets(dataSetsRaw);

class Demo extends Component {
	render() {
		// console.log();
		return (
			<App url={this.props.url}>
				<ul>
					{this.props.organisations &&
						this.props.organisations.map((organisation, i) => {
							const orgId = organisation.organisationId.toLowerCase();

							return (
								<li key={`organisation-${i}`}>
									<Link
										href={`/${organisation.organisationId.toLowerCase()}`}
										as={`/${organisation.organisationId.toLowerCase()}`}
									>
										<a>{organisation.title}</a>
									</Link>

									<ul>
										{organisation.dataSets.map((dataSet) => (
											<li>
												<Link href={`/${orgId}/${dataSet.originalId}`}>
													<a>{dataSet.title}</a>
												</Link>
											</li>
										))}
									</ul>
								</li>
							);
						})}
				</ul>
			</App>
		);
	}
}

const query = gql`
	query {
		organisations: allOrganisations {
			organisationId
			title
			dataSets {
				title
				originalId
			}
		}
	}
`;

export default withData(
	graphql(query, {
		props: ({ data }) => {
			// console.log(data);
			return data;
		},
	})(Demo),
);
