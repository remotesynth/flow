import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import { safePrefix } from '../utils';
import Header from './HeaderForm';
import Footer from './Footer';

export default class Body extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            {_.get(this.props, 'pageContext.frontmatter.title', null) &&
              _.get(this.props, 'pageContext.frontmatter.title', null) + ' - '}
            {_.get(this.props, 'pageContext.site.siteMetadata.title', null)}
          </title>
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initialScale=1.0'
          />
          <meta name='google' content='notranslate' />
          <link
            href='https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,700i'
            rel='stylesheet'
          />
          <link rel='stylesheet' href={safePrefix('assets/css/main.css')} />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/images/favicon/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/images/favicon/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/images/favicon/favicon-16x16.png'
          />
          <link rel='manifest' href='/images/favicon/site.webmanifest'></link>
        </Helmet>
        <div
          id='page'
          className={
            'site palette-' +
            _.get(this.props, 'pageContext.site.siteMetadata.palette', null)
          }
        >
          {this.props.showHeader && <Header {...this.props} />}
          <main id='content' className='site-content'>
            {this.props.children}
          </main>
          {this.props.showFooter && <Footer {...this.props} />}
        </div>
      </React.Fragment>
    );
  }
}

Body.propTypes = {
  children: PropTypes.node,
  showFooter: PropTypes.bool,
  showHeader: PropTypes.bool,
};
Body.defaultProps = {
  showHeader: true,
  showFooter: true,
};
