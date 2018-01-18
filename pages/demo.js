import { Component } from 'react';
import { gql, graphql } from 'react-apollo';

import App from '../components/App';
import Link from '../components/Link';
import withData from '../lib/withData';

class Demo extends Component {
	render() {
		// console.log();
		return (
			<App url={this.props.url}>
				<h1>DataSets</h1>
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
												<Link
													route={`/${orgId}/${dataSet.originalId}`}
													prefetch
												>
													<a>{dataSet.title}</a>
												</Link>

												<ul>
													{dataSet.dimensions.map((dimension) => (
														<li>
															{dimension.name}

															<ul>
																{dimension.dimensionValues.map(
																	(dimensionValue) => (
																		<li>{dimensionValue.name}</li>
																	),
																)}
															</ul>
														</li>
													))}
												</ul>
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
		allOrganisations {
			organisationId
			title
			dataSets(last: 5) {
				title
				originalId
				dimensions {
					name
					dimensionValues {
						name
					}
				}
			}
		}
	}
`;

export default withData(
	graphql(query, {
		props: ({ data }) => {
			// console.log('demo');
			console.log(data);

			return {
				organisations: data.allOrganisations,
				...data,
			};
		},
	})(Demo),
);
