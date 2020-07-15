import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import MaskedInput from 'react-text-mask';
import { useForm } from './OnboardingForm';

const Input = (props) => {
  const {
    label,
    mask,
    name,
    placeholder,
    disabled,
    component: InputComponent,
    inputMode,
    paddingX,
    paddingY,
    noLabel,
  } = props;
  const { values, errors, touched, handleChange, handleBlur } = useForm();
  const isTouched = touched[name];
  const error = errors[name];
  return (
    <Container $paddingX={paddingX} $paddingY={paddingY}>
      <Label $hidden={noLabel}>{label}</Label>
      <InputComponent
        $valid={isTouched && !error}
        $invalid={isTouched && !!error}
        name={name}
        onBlur={props.onBlur || handleBlur}
        onChange={props.onChange || handleChange}
        placeholder={placeholder || label}
        value={props.value || values[name]}
        mask={mask}
        showMask={true}
        onFocus={(e) => mask && e.target.select()}
        inputMode={inputMode}
        disabled={disabled}
      />
      {!!(touched[name] && errors[name]) && (
        <ErrorLabel>{errors[name]}</ErrorLabel>
      )}
    </Container>
  );
};

export default Input;

const Container = styled.div`
  padding: ${(props) => `${props.$paddingY}px ${props.$paddingX}px`};
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  opacity: 0.5;
  color: #000000;
`;
export const ErrorLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
  color: #ca3244;
`;

export const InputBase = styled(MaskedInput)`
  padding: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => {
    if (props.$invalid) {
      return '#ca3244';
    }
    if (props.$valid) {
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
`;
Input.propTypes = {
  component: PropTypes.any,
  inputMode: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  mask: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  name: PropTypes.string.isRequired,
  formatChars: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  formatValue: PropTypes.func,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  noLabel: PropTypes.bool,
};
Input.defaultProps = {
  value: null,
  mask: false,
  formatValue: (e) => e.target.value,
  component: InputBase,
  disabled: false,
  paddingX: 15,
  paddingY: 15,
  noLabel: false,
};
