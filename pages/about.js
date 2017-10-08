import App from '../components/App';
import { gql, graphql } from 'react-apollo';

import withData from '../lib/withData';

const AboutPage = ((props) => (
  <App url={props.url}>
    <article>
      <h1>The Idea Behind This Example</h1>
    </article>
  </App>
))

const allObjects = gql`
  query {
    dataSets: allDataSets {
      title
      originalId
      abstract
    }
  }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (ExamplePage)
export default withData(graphql(allObjects, {
  props: ({ data }) => {
    console.log(data);

    return {
      ...data,
    };
  },
})(AboutPage));
