import React, { useState } from 'react';
import Input from './Input';
import { useForm } from './OnboardingForm';
import styled from 'styled-components';
import { Loader } from './Loader';

const name = 'cnpj';
const mask = [
  '(',
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  ')',
];
const CnpjInput = () => {
  const { setFieldValue, values } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { value } = e.target;
    const formatted = value.replace(/\D/g, '');
    setFieldValue(name, value, false);
    if (formatted.length === 14) {
      setIsLoading(true);
      fetch(
        `https://consulta-cnpj-gratis.p.rapidapi.com/companies/${formatted}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'consulta-cnpj-gratis.p.rapidapi.com',
            'x-rapidapi-key':
              'd19a7752b8mshe8fe2084d6f1f45p13408ajsn4945cb360eba',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setFieldValue('company', null);
          } else {
            setFieldValue('company', data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setFieldValue('company', null);
          console.error(err);
        });
    }
  };

  return (
    <>
      <Input mask={mask} name={name} label='CNPJ' onChange={handleChange} />
      {isLoading ? (
        <Loader />
      ) : (
        <CompanyName>{values.company?.name ?? 'No match'}</CompanyName>
      )}
    </>
  );
};

export default CnpjInput;

const CompanyName = styled.p`
  font-size: 1rem;
  margin: 0 15px;
  font-weight: 700;
`;