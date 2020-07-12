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
        <Logo src={pageContext.frontmatter?.meta?.logo} />
        <Title>{pageContext.frontmatter.title}</Title>
        <Stepper current={step} setStep={setStep} steps={STEPS} />
      </StepperContainer>
      <FormContainer>
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
  min-height: 100vh;
  background: white;
  display: flex;
`;
const StepperContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(to right, #438945, #73bb75);
  width: 30%;
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 2rem;
`;
const FormContainer = styled.div`
  min-height: 100%;
  width: 70%;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: -2px 0 5px #438945;
`;
const Title = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin: 0;
  text-align: center;
`;
const StepTitle = styled.h3`
  font-size: 1.8rem;
`;
const Logo = styled.img`
  width: 80px;
  margin: auto;
`;
