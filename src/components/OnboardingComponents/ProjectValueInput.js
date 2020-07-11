import PropTypes from 'prop-types';
import React from 'react';
import { Label, ErrorLabel } from './Input';
import Slider from 'react-slider';
import styled from 'styled-components';
import { useForm } from './OnboardingForm';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const defaultMaskOptions = {
  prefix: 'R$ ',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2,
  integerLimit: 9,
  allowNegative: false,
  allowLeadingZeroes: true,
};
const name = 'projectValue';

const SliderThumbIcon = () => (
  <svg viewBox='0 0 560 560'>
    <path
      d='M545.326,265.792l-130.92-74.701c-10.44-5.955-18.904-1.041-18.904,10.979V351.08c0,12.02,8.464,16.935,18.904,10.979
			l130.92-74.694C555.767,281.404,555.767,271.746,545.326,265.792z'
    />
    <path
      d='M138.75,191.091L7.831,265.792c-10.441,5.955-10.441,15.618,0,21.573l130.919,74.7
			c10.441,5.955,18.905,1.041,18.905-10.979V202.07C157.648,190.05,149.191,185.136,138.75,191.091z'
    />
  </svg>
);

export const stripCurrency = (str) =>
  str.replace('R$', '').replaceAll('.', '').replaceAll(',', '.');
/**
 *
 * @param {number} num
 * @returns {string} formatted string without the currency sign, but with thousand and decimal separators
 */
export const formatCurrency = (num) => Intl.NumberFormat('pt-BR').format(num);

const ProjectValueInput = ({ max }) => {
  const { values, errors, touched, setFieldValue, handleBlur } = useForm();
  const currencyMask = createNumberMask(defaultMaskOptions);
  const value = values[name];
  const numValue = Number(stripCurrency(value));
  return (
    <Container>
      <Label>Value of the Project</Label>

      <Input
        mask={currencyMask}
        name={name}
        value={value}
        onChange={(e) => {
          const num = +stripCurrency(e.target.value ?? '0');
          if (e.target.value) {
            setFieldValue(
              name,
              num > max ? formatCurrency(max) : e.target.value.replace('R$', '')
            );
          } else {
            setFieldValue(name, '0');
          }
        }}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        inputMode='decimal'
        $valid={touched[name] && !errors[name]}
        $invalid={touched[name] && !!errors[name]}
      />

      <StyledSlider
        min={0}
        max={max}
        value={numValue}
        step={1000}
        onChange={(val) => setFieldValue(name, formatCurrency(val))}
        renderTrack={(props, state) => (
          <SliderTrack {...props} index={state.index} />
        )}
        renderThumb={(props) => (
          <SliderThumb {...props}>
            <SliderThumbIcon />
          </SliderThumb>
        )}
      />
      {!!(touched[name] && errors[name]) && (
        <ErrorLabel>{errors[name]}</ErrorLabel>
      )}
    </Container>
  );
};

ProjectValueInput.propTypes = {
  max: PropTypes.number.isRequired,
};

export default ProjectValueInput;

export const Container = styled.div`
  padding: 0 15px;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
`;
export const Input = styled(MaskedInput)`
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
  margin-bottom: 1rem;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  height: 25px;
`;
const SliderThumb = styled.div`
  height: 25px;
  width: 25px;
  background-color: #438945;
  border-radius: 50%;
  cursor: grab;
  transition: transform ease 0.1s;
  text-align: center;
  :hover {
    transform: scale(1.05);
  }
  svg {
    fill: white;
    width: 16px;
  }
`;
const SliderTrack = styled.div`
  top: 50%;
  transform: translateY(-50%);
  bottom: 0;
  height: 5px;
  border-radius: 3px;
  background: ${(props) => (props.index === 0 ? '#73bb75' : '#ddd')};
`;
