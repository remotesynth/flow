import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import get from 'lodash/get';
import { navigate } from 'gatsby';
import Stepper from './OnboardingComponents/Stepper';
import firebase from 'gatsby-plugin-firebase';
import { Loader } from './OnboardingComponents/Loader';

const STEPS = {
  1: 'Sobre Você',
  2: 'Sobre o Projeto',
  3: 'CNPJ da Empresa',
  4: 'Revisar e Enviar',
};
const Onboarding = (props) => {
  const { location } = props;
  const autofillUser = get(location, 'state.autofillUser', false);
  const [step, setStep] = useState(autofillUser ? 2 : 1);
  const email = get(location, 'state.email', null);
  /**
   * @type {[{}, Function]}
   */
  const [user, setUser] = useState(null);
  console.log('user: ', user);
  useEffect(() => {
    if (!email && !(autofillUser && firebase.auth().currentUser)) {
      navigate('/');
    }
  }, [email]);
  useEffect(() => {
    if (autofillUser) {
      const { currentUser } = firebase.auth();
      if (!currentUser) {
        navigate('/');
        throw new Error('No signed in user');
      }
      firebase
        .firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then((snapshot) => snapshot.data())
        .then((user) => setUser(user));
    }
  }, []);
  const initialValues = autofillUser
    ? {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        userType: user?.userType,
      }
    : {
        email,
      };
  return (
    <Container>
      <StepperContainer>
        <Stepper current={step} setStep={setStep} steps={STEPS} />
      </StepperContainer>
      <FormContainer>
        <StepTitle>{STEPS[step]}</StepTitle>
        {user || !autofillUser ? (
          <OnboardingForm
            step={step}
            setStep={setStep}
            initialValues={initialValues}
            disableUserStep={autofillUser}
          />
        ) : (
          <Loader />
        )}
      </FormContainer>
    </Container>
  );
};

Onboarding.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
  pageContext: PropTypes.shape({
    frontmatter: PropTypes.shape({
      meta: PropTypes.shape({
        logo: PropTypes.string,
      }),
      title: PropTypes.string,
    }),
  }),
};

export default Onboarding;

const Container = styled.div`
  min-height: 100%;
  background: white;
  display: flex;
  overflow-y: visible;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const StepperContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(to right, #438945, #73bb75);
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem;
  z-index: 1000;
  @media (max-width: 768px) {
    min-height: unset;
    height: 64px;
    width: 90%;
    position: absolute;
    background: white;
  }
`;
const FormContainer = styled.div`
  min-height: 100%;
  width: 70%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
    padding-top: 6rem;
    box-shadow: none;
  }
`;
const StepTitle = styled.h3`
  font-size: 1.2rem;
  margin: 30px 0 50px 0;
  margin-top: 40px !important;
`;