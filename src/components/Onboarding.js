import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import get from 'lodash/get';
import { navigate } from 'gatsby';
import Stepper from './OnboardingComponents/Stepper';

const Onboarding = (props) => {
  const [step, setStep] = useState(1);
  const { pageContext, location } = props;
  const email = get(location, 'state.email', null);
  if (!email) {
    navigate('/');
  }
  return (
    <Container>
      <StepperContainer>
        <Title>{pageContext.frontmatter.title}</Title>
        <Stepper
          current={step}
          setStep={setStep}
          steps={pageContext.frontmatter.steps}
        />
      </StepperContainer>
      <FormContainer>
        <StepTitle>{pageContext.frontmatter.steps[step]}</StepTitle>
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
      steps: PropTypes.object,
      title: PropTypes.string,
    }),
  }),
};

export default Onboarding;

const Container = styled.div`
  min-height: 90vh;
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
const FormContainer = styled.form`
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
`;
const StepTitle = styled.h3`
  font-size: 1.8rem;
`;
