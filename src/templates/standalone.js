import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { graphql } from 'gatsby';

import components, { Layout } from '../components/index';

// this minimal GraphQL query ensures that when 'gatsby develop' is running,
// any changes to content files are reflected in browser
export const query = graphql`
  query($url: String) {
    sitePage(path: { eq: $url }) {
      id
    }
  }
`;

const Standalone = (props) => {
  const component = upperFirst(
    camelCase(get(props, 'pageContext.frontmatter.component', null))
  );
  const Component = components[component];
  return (
    <Layout showHeader={true} showFooter={false} {...props}>
      <Component {...props} />
    </Layout>
  );
};

Standalone.propTypes = {
  pageContext: PropTypes.shape({
    site: PropTypes.any,
  }),
};
export default Standalone;
