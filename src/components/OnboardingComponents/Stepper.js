import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Stepper = ({ current, steps, setStep }) => {
  const entries = Object.entries(steps);
  return (
    <Container>
      {entries.map(([key, step]) => (
        <Step key={key} $step={key} $isCurrent={current == key}>
          <StepIcon
            $isComplete={key < current}
            onClick={key < current ? () => setStep(+key) : null}
            $isCurrent={current == key}
          >
            {key}
          </StepIcon>
          {step}
          {key != entries.length && <StepTrail $isBold={key < current} />}
        </Step>
      ))}
    </Container>
  );
};

Stepper.propTypes = {
  current: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  steps: PropTypes.object.isRequired,
};

export default Stepper;

const Container = styled.div`
  width: 100%;
  color: white;
  text-align: center;
`;
const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StepIcon = styled.div`
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  background: ${(props) => (props.$isCurrent ? '#438945' : 'none')};
  font-weight: ${(props) => (props.$isCurrent ? '700' : '400')};
  cursor: ${(props) => (props.$isComplete ? 'pointer' : 'default')};
  border: 1px solid #438945;
  border-radius: 50%;
`;
const StepTrail = styled.div`
  width: ${(props) => (props.$isBold ? '2px' : '1px')};
  height: 2rem;
  margin-bottom: 6px;
  border-radius: 2px;
  background: #438945;
  opacity: ${(props) => (props.$isBold ? 1 : 0.7)};
`;
