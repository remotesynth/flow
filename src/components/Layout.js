import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import firebase from 'gatsby-plugin-firebase';

import { Link , safePrefix } from '../utils';
import Header from './Header';
import Footer from './Footer';
import EmailModal from './EmailModal';
import { sendFirebaseSignInEmail } from './OnboardingComponents/onboarding.requests';
import { navigate } from 'gatsby';
import { useAlert } from './Alert';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

const Body = (props) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        setIsUserLoggedIn(!!user);
      }),
    []
  );
  const hasMounted = useHasMounted();
  const alert = useAlert();
  return (
    <>
      <Helmet>
        <title>
          {_.get(props, 'pageContext.frontmatter.title', null) &&
            _.get(props, 'pageContext.frontmatter.title', null) + ' - '}
          {_.get(props, 'pageContext.site.siteMetadata.title', null)}
        </title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initialScale=1.0' />
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
          _.get(props, 'pageContext.site.siteMetadata.palette', null)
        }
      >
        {props.showHeader && (
          <Header {...props}>
            {hasMounted &&
              (isUserLoggedIn ? (
                <div className="menu-item">
                  <li
                    className='menu-item menu-button'>
                    <Link to={safePrefix('/dashboard')} className='button pointer'>Meus Projetos</Link>
                  </li>
                  <li
                    className='menu-item menu-button'
                    onClick={async () => {
                      await firebase.auth().signOut();
                      navigate('/');
                    }}>
                    <a className='button pointer'>Sair</a>
                  </li>
                </div>
              ) : (
                <li className='menu-item menu-button' onClick={openLogin}>
                  <a className='button pointer'>Meus Projetos</a>
                </li>
              ))}
          </Header>
        )}
        <main id='content' className='site-content'>
          {props.children}
        </main>
        {props.showFooter && <Footer {...props} />}
      </div>
      {showLoginModal && (
        <EmailModal
          onClose={closeLogin}
          onSubmit={async (email) => {
            await sendFirebaseSignInEmail(email);
            closeLogin();
            alert(
              'Enviamos um email com um link direto para acessar o seu Dashboard'
            );
          }}
        />
      )}
    </>
  );
};

Body.propTypes = {
  children: PropTypes.node,
  showFooter: PropTypes.bool,
  showHeader: PropTypes.bool,
};
Body.defaultProps = {
  showHeader: true,
  showFooter: true,
};
export default Body;
