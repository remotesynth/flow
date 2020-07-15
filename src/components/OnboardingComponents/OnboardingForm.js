import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import Input from './Input';
import * as yup from 'yup';
import ProjectValueInput, { stripCurrency } from './ProjectValueInput';
import CnpjInput from './CnpjInput';
import Summary from './Summary';
import { navigate } from 'gatsby';
import {
  sendDataToZapier,
  sendFirebaseSignInEmail,
} from './onboarding.requests';

const Wizard = ({ step, setStep, children }) => {
  const { validateForm, setFieldTouched, submitForm, isSubmitting } = useForm();

  const steps = React.Children.toArray(children).filter(
    (child) => child.type === Step
  );
  const isLastStep = step === steps.length;
  const currentStep = steps[step - 1];

  const handleNext = async (e) => {
    e.preventDefault();
    const currentStepFieldNames = currentStep.props.fields;
    const errors = await validateForm();
    const invalidFields = currentStepFieldNames.filter((name) => errors[name]);
    if (invalidFields.length) {
      invalidFields.map((name) => setFieldTouched(name));
    } else if (!isLastStep) {
      setStep((prev) => prev + 1);
    } else {
      submitForm();
    }
  };
  const handleBack = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };
  const buttonText = isLastStep ? 'Submit' : 'Next';
  return (
    <Container>
      <FieldsContainer>{currentStep}</FieldsContainer>
      <ButtonContainer>
        <Button type='button' onClick={handleNext}>
          {isSubmitting ? 'Submitting...' : buttonText}
        </Button>
        {step >= 2 && (
          <Button
            onClick={handleBack}
            type='button'
            className='button secondary'
          >
            Back
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

Wizard.propTypes = {
  children: PropTypes.node,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
};

const Step = ({ children }) => children ?? null;

export const FormContext = React.createContext();
export const useForm = () => useContext(FormContext);
const PROJECT_VALUE_MAX = 2000000;

const onSubmit = async (values) => {
  const zapPromise = sendDataToZapier(values);
  const firebasePromise = sendFirebaseSignInEmail(values.email);
  await Promise.all([zapPromise, firebasePromise]);
  navigate('/thank-you');
};
const phoneMask = (val) => {
  const num = val.replace(/\D/g, '');
  if (num.length >= 11) {
    return [
      '(',
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }
  return [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
};
const OnboardingForm = (props) => {
  const FormikBag = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: props.initialValues.email || '',
      projectValue: '0',
      projectDescription: '',
      cnpj: '',
      company: null,
      terms: false,
    },
    onSubmit,
    validationSchema,
  });
  return (
    <FormContext.Provider value={FormikBag}>
      <Wizard step={props.step} setStep={props.setStep}>
        <Step fields={['firstName', 'lastName', 'phone', 'email']}>
          <InputGroup>
            <Input name='firstName' label='First Name' />
            <Input name='lastName' label='Last Name' />
          </InputGroup>
          <Input mask={phoneMask} name='phone' label='Phone' />
          <Input name='email' label='Email' disabled />
        </Step>
        <Step fields={['projectValue', 'projectDescription']}>
          <ProjectValueInput max={PROJECT_VALUE_MAX} />
          <Input
            name='projectDescription'
            label='Description'
            component={Textarea}
            placeholder='Project description'
          />
        </Step>
        <Step fields={['cnpj']}>
          <CnpjInput />
        </Step>
        <Step fields={['terms']}>
          <Summary />
        </Step>
      </Wizard>
    </FormContext.Provider>
  );
};

OnboardingForm.propTypes = {
  initialValues: PropTypes.shape({
    email: PropTypes.string,
  }),
  setStep: PropTypes.func,
  step: PropTypes.number,
};

const phoneRegex = RegExp(/^([(][1-9]{2}[)] )?[0-9]{4,5}[-]?[0-9]{4}$/);

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegex, 'Invalid phone format'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  projectValue: yup
    .string()
    .test(
      'is positive',
      'Enter Project Value',
      (val) => +stripCurrency(val) >= 1
    ),
  projectDescription: yup.string().required('Project Description is required'),
  cnpj: yup.string().test('company exists', 'Insira o CNPJ', function () {
    return this.parent.company;
  }),
  company: yup.object(),
  terms: yup
    .boolean()
    .oneOf([true], 'The Terms and Conditions must be accepted'),
});

export default OnboardingForm;

const Container = styled.div`
  width: 80%;
  max-width: 85%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 500px;
  @media (max-width: 768px) {
    margin: 20px;
    width: 90%;
    max-width: 100%;
  }
`;
const FieldsContainer = styled.div`
  width: 100%;
`;
const Button = styled.button`
  font-weight: 700;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin: 2rem 0;
  flex-flow: row-reverse;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Textarea = styled.textarea`
  padding: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => {
    if (props.invalid) {
      return '#ca3244';
    }
    if (props.valid) {
      return '#438945';
    }
    return '#ebecf0';
  }};
  border-radius: 3px;
  width: 100%;
  box-sizing: border-box;
  color: #2c3e50;
  font-size: 0.875rem;
  transition: all ease 0.2s;
  margin-bottom: 1rem;
  min-width: 100%;
`;
