/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
require('firebase/auth');
require('firebase/firestore');

const React = require('react');
const { AlertProvider } = require('./src/components/Alert');

exports.onInitialClientRender = () => {
  if (
    'onGatsbyInitialClientRender' in window &&
    typeof window.onGatsbyInitialClientRender === 'function'
  ) {
    window.onGatsbyInitialClientRender();
  }
};

exports.onRouteUpdate = () => {
  if (
    'onGatsbyRouteUpdate' in window &&
    typeof window.onGatsbyRouteUpdate === 'function'
  ) {
    window.onGatsbyRouteUpdate();
  }
};

exports.wrapRootElement = ({ element }) => (
  <AlertProvider>{element}</AlertProvider>
);
