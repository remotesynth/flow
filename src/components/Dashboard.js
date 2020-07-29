import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'gatsby-plugin-firebase';
import { Loader } from './OnboardingComponents/Loader';
import styled from 'styled-components';
import get from 'lodash/get';
import { sendFirebaseSignInEmail } from './OnboardingComponents/onboarding.requests';
import { navigate } from 'gatsby';
import EmailModal from './EmailModal';
import DealsList from './DealsList';
import { useAlert } from './Alert';

const handleNewProject = () => {
  navigate('/new_project', {
    state: {
      autofillUser: true,
    },
  });
};

const Dashboard = ({ signOut, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deals, setDeals] = useState({
    list: [],
    error: null,
  });

  useEffect(() => {
    setIsLoading(true);
    getDeals(firebase.auth().currentUser).then((res) => {
      setDeals(res);
      setIsLoading(false);
    });
  }, []);

  if (deals.error) {
    return 'Something went wrong, please try again.';
  }
  return (
    <>
      <NewProjectButton onClick={handleNewProject}>
        Submit New Project
      </NewProjectButton>
      <Card>
        {deals?.list?.length < 1 && (
          <p>
            Por favor aguarde um momento, estamos processando as informações
            enviadas
          </p>
        )}
        {isLoading ? <Loader centered /> : <DealsList deals={deals.list} />}
      </Card>
      <Row>
        <span>
          Email cadastrado: <b>{get(user, 'email', '...')}</b>
        </span>
        <button onClick={signOut}>Sair</button>
      </Row>
    </>
  );
};

Dashboard.propTypes = {
  signOut: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const DashboardPage = () => {
  return (
    <ClientOnly>
      <AuthWrapper>{(props) => <Dashboard {...props} />}</AuthWrapper>;
    </ClientOnly>
  );
};
export default DashboardPage;

export const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted ? children : null;
};
/**
 *
 * @param {firebase.User} user
 * @returns {{list: *[], error: *}}
 */
const getDeals = async (user) => {
  try {
    const db = firebase.firestore();
    const snapshot = await db
      .collection('Deals')
      .where('deal_email', '==', user?.email)
      .get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { list, error: null };
  } catch (error) {
    console.error(error);
    return { list: null, error };
  }
};

const authenticateWithLink = (email) => {
  return firebase
    .auth()
    .signInWithEmailLink(email, window.location.href)
    .then((resp) => resp.user);
};

const NewProjectButton = styled.button`
  margin-bottom: 1rem;
`;
const Card = styled.div`
  background: white;
  box-shadow: 0 2px 3px #ccc;
  border-radius: 5px;
  min-height: 100px;
  margin-bottom: 2rem;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  button {
    white-space: nowrap;
  }
  span {
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return { initializing: !user, user };
  });
  function onChange(user) {
    setState({ initializing: false, user });
  }
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return unsubscribe;
  }, []);

  return state;
};

const AuthWrapper = ({ children }) => {
  const alert = useAlert();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const localstorageEmail = window.localStorage.getItem('emailForSignIn');
  const [authEmail, setAuthEmail] = useState(localstorageEmail);
  const { user, initializing } = useAuth();
  const showConfirmEmail =
    !authEmail && !initializing && !user && !showLoginModal;

  const onEmailSent = async () => {
    alert('Enviamos um email com um link direto para acessar o seu Dashboard');
    navigate('/');
  };

  useEffect(() => {
    if (user || initializing) return;
    const queryEmail = new URLSearchParams(window.location.search)
      .get('email')
      ?.replace(' ', '+');
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      if (authEmail) {
        authenticateWithLink(authEmail).catch(async (error) => {
          switch (error.code) {
            case 'auth/invalid-action-code': {
              window.localStorage.removeItem('emailForSignIn');
              alert(
                'Link de acesso expirou para sua segurança. Por favor informe seu email para receber um novo link'
              );
              setShowLoginModal(true);
              break;
            }
            case 'auth/invalid-email': {
              alert('Invalid Email');
              setAuthEmail('');
              break;
            }
          }
        });
      }
    } else if (queryEmail) {
      sendFirebaseSignInEmail(queryEmail).then(onEmailSent);
    } else {
      setShowLoginModal(true);
    }
  }, [authEmail, initializing]);

  const signOut = useCallback(async () => {
    navigate('/');
    firebase.auth().signOut();
  }, []);

  return (
    <>
      {showLoginModal && (
        <EmailModal
          onSubmit={async (email) => {
            await sendFirebaseSignInEmail(email);
            setShowLoginModal(false);
            onEmailSent();
          }}
          noClose
        />
      )}
      {showConfirmEmail && (
        <EmailModal
          title='Por favor informe seu email para confirmação'
          buttonText='Confirm'
          onSubmit={(email) => {
            setAuthEmail(email);
          }}
          noClose
        />
      )}
      {user ? children({ signOut, user }) : null}
    </>
  );
};

AuthWrapper.propTypes = {
  children: PropTypes.func,
};
