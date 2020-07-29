import PropTypes from 'prop-types';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { FormContext } from './OnboardingComponents/OnboardingForm';
import Input from './OnboardingComponents/Input';
import * as yup from 'yup';

const EmailModal = (props) => {
  const { onClose, onSubmit } = props;
  const FormikBag = useFormik({
    onSubmit: ({ email }) => onSubmit(email),
    initialValues: { email: props.initial || '' },
    validateOnBlur: false,
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email('Invalid email format')
        .required('Email é um campo obrigatório'),
    }),
  });
  return (
    <FormContext.Provider value={FormikBag}>
      <ModalContainer>
        <OutsideClickHandler onOutsideClick={onClose}>
          <Container
            onSubmit={(e) => {
              e.preventDefault();
              FormikBag.submitForm();
            }}
          >
            <Header>
              <Title>{props.title}</Title>
              {!props.noClose && <CloseButton onClick={onClose}>×</CloseButton>}
            </Header>
            <Input name='email' label='Email' />
            <ButtonContainer>
              <Button type='button' onClick={FormikBag.submitForm}>
                {FormikBag.isSubmitting ? 'Sending...' : props.buttonText}
              </Button>
            </ButtonContainer>
          </Container>
        </OutsideClickHandler>
      </ModalContainer>
    </FormContext.Provider>
  );
};

EmailModal.defaultProps = {
  onClose: () => {},
  title: 'Login',
  buttonText: 'Send login link'
};
EmailModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  noClose: PropTypes.bool,
  initial: PropTypes.string,
  title: PropTypes.string,
  buttonText: PropTypes.string,
};

export default EmailModal;

const Container = styled.form`
  background: white;
  border-radius: 5px;
  padding: 1.5rem 2rem;
`;
const ModalContainer = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: #00000080;
  z-index: 100000;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseButton = styled.span`
  font-size: 1.6rem;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  flex-flow: row-reverse;
`;
const Button = styled.button`
  background: #438945;
  border-color: #438945;
`;
const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  max-width: 350px;
  margin: 0 15px;
`;
