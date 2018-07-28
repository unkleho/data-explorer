import { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

import './ChartEditorContainer.css';

class ChartEditorContainer extends Component {
	static propTypes = {
		orgSlug: PropTypes.string,
		dataSetSlug: PropTypes.string,
	};

	render() {
		const { orgSlug, dataSetSlug } = this.props;

		if (!orgSlug || !dataSetSlug) {
			return null;
		}

		return (
			<div className="chart-editor-container">
				<Query
					query={gql`
						query dataSet($orgSlug: String!, $dataSetSlug: String!) {
							dataSet(orgSlug: $orgSlug, slug: $dataSetSlug) {
								title
								tags {
									name
									slug
								}
								category {
									name
									slug
								}
							}
						}
					`}
					variables={{
						orgSlug,
						dataSetSlug,
					}}
				>
					{({ data, loading, error }) => {
						const { dataSet } = data;

						if (loading || error || !dataSet) {
							return null;
						}

						return (
							<Fragment>
								<p>
									{'Tags: '}
									{dataSet.tags &&
										dataSet.tags.map((tag) => <span>{tag.name}</span>)}
									<br />
									{dataSet.tags.length === 0 && (
										<Mutation
											mutation={gql`
												mutation update(
													$identifier: String!
													$tagSlug: String
												) {
													addDataSetTag(
														identifier: $identifier
														tagSlug: $tagSlug
													) {
														identifier
														title
														tags {
															name
															slug
														}
													}
												}
											`}
										>
											{(addDataSet, { data }) => {
												console.log(data);

												return (
													<form
														onSubmit={(e) => {
															e.preventDefault();
															console.log('Updated');

															addDataSet({
																variables: {
																	identifier: `${orgSlug}__${dataSetSlug}`,
																	tagSlug: 'featured',
																},
															});

															window.location.reload();
														}}
													>
														<button type="submit" className="button">
															Add featured
														</button>
													</form>
												);
											}}
										</Mutation>
									)}

									{dataSet.tags.length > 0 &&
										dataSet.tags[0].slug === 'featured' && (
											<Mutation
												mutation={gql`
													mutation update(
														$identifier: String!
														$tagSlug: String
													) {
														removeDataSetTag(
															identifier: $identifier
															tagSlug: $tagSlug
														) {
															identifier
															title
															tags {
																name
																slug
															}
														}
													}
												`}
											>
												{(removeDataSet, { data }) => {
													// console.log(data);

													return (
														<form
															onSubmit={(e) => {
																e.preventDefault();
																console.log('Updated');

																removeDataSet({
																	variables: {
																		identifier: `${orgSlug}__${dataSetSlug}`,
																		tagSlug: 'featured',
																	},
																});

																window.location.reload();
															}}
														>
															<button type="submit" className="button">
																Remove featured
															</button>
														</form>
													);
												}}
											</Mutation>
										)}
								</p>

								<p>
									{/* Categories */}
									{`Category: ${
										dataSet.category ? dataSet.category.name : 'none'
									}`}
									<br />

									{[
										'economy',
										'industry',
										'labour',
										'people',
										'environment',
										'heath',
										'other',
									].map((categorySlug) => {
										return (
											<Mutation
												mutation={gql`
													mutation update(
														$identifier: String!
														$categorySlug: String
													) {
														addDataSetCategory(
															identifier: $identifier
															categorySlug: $categorySlug
														) {
															identifier
															title
															category {
																name
																slug
															}
														}
													}
												`}
											>
												{(addDataSetCategory, { data }) => {
													// console.log(data);

													return (
														<form
															onSubmit={(e) => {
																e.preventDefault();
																console.log('Updated');

																addDataSetCategory({
																	variables: {
																		identifier: `${orgSlug}__${dataSetSlug}`,
																		categorySlug: categorySlug,
																	},
																});

																window.location.reload();
															}}
														>
															<button
																type="submit"
																className="button chart-editor-container__button"
															>
																{categorySlug}
															</button>
														</form>
													);
												}}
											</Mutation>
										);
									})}
								</p>
							</Fragment>
						);
					}}
				</Query>
			</div>
		);
	}
}

export default ChartEditorContainer;
