import React from 'react';
import { navigate } from 'gatsby';
import Input from './OnboardingComponents/Input';
import { FormContext } from './OnboardingComponents/OnboardingForm';
import { useFormik } from 'formik';
import * as yup from 'yup';
import styled from 'styled-components';
import firebase from 'gatsby-plugin-firebase';
import { sendFirebaseSignInEmail } from './OnboardingComponents/onboarding.requests';
import { useAlert } from './Alert';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Por favor inserir seu email'),
});
const StartForm = () => {
  const alert = useAlert();
  const onSubmit = async (values) => {
    const { email } = values;
    const user = firebase.auth().currentUser;

    if (user?.email !== email) {
      await firebase.auth().signOut();
    }

    const resp = await firebase.auth().fetchSignInMethodsForEmail(email);
    if (resp.length && !user) {
      await sendFirebaseSignInEmail(email);
      return alert(
        'Looks like you already have an account with us so we sent you a link for direct login'
      );
    }
    const formData = new FormData();
    formData.append('email', email);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch(
      'https://hooks.zapier.com/hooks/catch/142211/ozo0et4/',
      requestOptions
    );

    user?.email === email
      ? navigate('/new_project', {
          state: {
            autofillUser: true,
          },
        })
      : navigate('/signup', { state: { email } });
  };
  const FormikBag = useFormik({
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit,
    validationSchema,
  });

  return (
    <FormContext.Provider value={FormikBag}>
      <form
        name='startForm'
        id='start-form'
        className='start-form'
        onSubmit={(e) => {
          e.preventDefault();
          FormikBag.submitForm();
        }}
      >
        <input type='hidden' name='form-name' value='startForm' />

        <div className='form-row'>
          <label>
            <span className='screen-reader-text'>Email Comercial</span>
            <Input
              name='email'
              noLabel
              placeholder='Seu Email Comercial'
              component={EmailInput}
              paddingX={0}
              paddingY={0}
            />
          </label>
        </div>
        <SubmitButton onClick={FormikBag.submitForm}>
          {FormikBag.isSubmitting ? 'Aguarde...' : 'Começar Agora'}
        </SubmitButton>
      </form>
    </FormContext.Provider>
  );
};

export default StartForm;

const EmailInput = styled.input`
  padding: 12px;
  background: hsl(122, 34%, 45%);
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => {
    if (props.$invalid) {
      return '#ca3244';
    }
    if (props.$valid) {
      return '#438945';
    }
    return 'hsl(122, 34%, 40%)';
  }};
  border-radius: 3px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  color: hsl(122, 34%, 95%);
  font-size: 0.875rem;
  transition: all ease 0.2s;
  + label {
    color: hsl(345, 90%, 95%);
  }
  ::placeholder {
    color: hsl(122, 34%, 80%);
    opacity: 1;
  }
  :hover {
    background: hsl(122, 34%, 46%);
  }
`;
const SubmitButton = styled.a`
  && {
    color: hsl(122, 34%, 90%);
    background: hsl(213, 80%, 50%);
    border: none;
    display: inline-block;
    border-radius: 3px;
    box-sizing: border-box;
    color: white;
    font-size: 16px;
    font-weight: 700;
    height: 2.5rem;
    width: 10rem;
    line-height: 1.5;
    padding: 0.7em 30px;
    transition: all 0.2s ease;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    :hover {
      color: white;
      background: hsl(213, 80%, 52%);
    }
  }
`;
