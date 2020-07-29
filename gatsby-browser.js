/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import { AlertProvider } from './src/components/Alert';

export const onInitialClientRender = () => {
  if (
    'onGatsbyInitialClientRender' in window &&
    typeof window.onGatsbyInitialClientRender === 'function'
  ) {
    window.onGatsbyInitialClientRender();
  }
};

export const onRouteUpdate = () => {
  if (
    'onGatsbyRouteUpdate' in window &&
    typeof window.onGatsbyRouteUpdate === 'function'
  ) {
    window.onGatsbyRouteUpdate();
  }
};

export const wrapRootElement = ({ element }) => (
  <AlertProvider>{element}</AlertProvider>
);
