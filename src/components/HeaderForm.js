import React from 'react';
import _ from 'lodash';

import {Link, safePrefix, classNames} from '../utils';

export default class Header extends React.Component {
    render() {
        return (
            <header id="masthead" className="site-header outer">
              <div className="inner">
                <div className="site-header-inside">
                  <div className="site-branding">
                    {_.get(this.props, 'pageContext.site.siteMetadata.header.logo_img', null) && (
                    <p className="site-logo">
                      <Link to={safePrefix('/')}>
                        <img src={safePrefix(_.get(this.props, 'pageContext.site.siteMetadata.header.logo_img', null))} alt="Logo" />
                      </Link>
                    </p>
                    )}
                    {((_.get(this.props, 'pageContext.frontmatter.template', null) === 'landing') || (_.get(this.props, 'pageContext.frontmatter.template', null) === 'blog')) ? (
                    <h1 className="site-title"><Link to={safePrefix('/')}>{_.get(this.props, 'pageContext.site.siteMetadata.header.title', null)}</Link></h1>
                    ) : 
                    <p className="site-title"><Link to={safePrefix('/')}>{_.get(this.props, 'pageContext.site.siteMetadata.header.title', null)}</Link></p>
                    }
                  </div>
                </div>
              </div>
            </header>
        );
    }
}
