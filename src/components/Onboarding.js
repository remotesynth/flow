import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import get from 'lodash/get';
import { navigate } from 'gatsby';
import Stepper from './OnboardingComponents/Stepper';

const STEPS = {
  1: 'About You',
  2: 'About the Project',
  3: 'Company ID',
  4: 'Review',
};
const Onboarding = (props) => {
  const [step, setStep] = useState(1);
  const { location, pageContext } = props;
  const email = get(location, 'state.email', null);
  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email]);
  return (
    <Container>
      <StepperContainer>
        <Title>{pageContext.frontmatter.title}</Title>
        <Stepper current={step} setStep={setStep} steps={STEPS} />
      </StepperContainer>
      <FormContainer>
        <Logo src={pageContext.frontmatter?.meta?.logo} />
        <StepTitle>{STEPS[step]}</StepTitle>
        <OnboardingForm
          step={step}
          setStep={setStep}
          initialValues={{ email }}
        />
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
    position: fixed;
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
const Title = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin: 0 0 2rem 0;
  text-align: center;
  @media (max-width: 768px) {
    display: none;
  }
`;
const StepTitle = styled.h3`
  font-size: 1.2rem;
  margin: 30px 0 50px 0;
`;
const Logo = styled.img`
  width: 110px;
  margin: 0;
`;
