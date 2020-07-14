import React from 'react';
import _ from 'lodash';
import { graphql } from 'gatsby';

import components, { Layout } from '../components/index';
import { safePrefix, htmlToReact } from '../utils';

// this minimal GraphQL query ensures that when 'gatsby develop' is running,
// any changes to content files are reflected in browser
export const query = graphql`
  query($url: String) {
    sitePage(path: { eq: $url }) {
      id
    }
  }
`;

export default class Page extends React.Component {
  render() {
    const component = _.upperFirst(
      _.camelCase(_.get(this.props, 'pageContext.frontmatter.component', null))
    );
    const Component = components[component];
    return (
      <Layout {...this.props}>
        <div className='outer'>
          <div className='inner-medium'>
            <article className='post post-full'>
              <header className='post-header'>
                <h1 className='post-title'>
                  {_.get(this.props, 'pageContext.frontmatter.title', null)}
                </h1>
              </header>
              {_.get(this.props, 'pageContext.frontmatter.image', null) && (
                <div className='post-thumbnail'>
                  <img
                    src={safePrefix(
                      _.get(this.props, 'pageContext.frontmatter.image', null)
                    )}
                    alt={_.get(
                      this.props,
                      'pageContext.frontmatter.title',
                      null
                    )}
                  />
                </div>
              )}
              {_.get(this.props, 'pageContext.frontmatter.subtitle', null) && (
                <div className='post-subtitle'>
                  {htmlToReact(
                    _.get(this.props, 'pageContext.frontmatter.subtitle', null)
                  )}
                </div>
              )}
              <div className='post-content'>
                {Component && <Component {...this.props} />}
                {htmlToReact(_.get(this.props, 'pageContext.html', null))}
              </div>
            </article>
          </div>
        </div>
      </Layout>
    );
  }
}
