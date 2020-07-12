import React from 'react';
import styled from 'styled-components';
import { useForm } from './OnboardingForm';
import { ErrorLabel } from './Input';

const Summary = () => {
  const { values, errors, touched, setFieldValue } = useForm();
  const { address } = values.company;
  const isAccepted = values.terms;

  return (
    <>
      <Card isAccepted={isAccepted}>
        <Line>
          <Block>
            <Name>
              {values.firstName} {values.lastName}
            </Name>
            <Secondary>{values.email}</Secondary>
            <Secondary>{values.phone}</Secondary>
          </Block>
          <Block>
            <Company>{values.company.name}</Company>
            <Secondary>CNPJ: {values.cnpj}</Secondary>
          </Block>
        </Line>
        <Line>
          <Block>
            <p>
              {address.street}, {address.number}
            </p>
            <p>{address.neighborhood}</p>
            <p>
              {address.city}, {address.state}
            </p>
            <p>{address.zip}</p>
          </Block>
        </Line>
        <Line>
          <Block>
            <TermsLabel isAccepted={isAccepted}>
              <Checkbox
                type='checkbox'
                checked={isAccepted}
                onChange={(e) => setFieldValue('terms', e.target.checked)}
              />
              <span>
                Accept Terms
                <br />
                and Conditions
              </span>
            </TermsLabel>
          </Block>
          <Block>
            <ProjectValue>R$ {values.projectValue}</ProjectValue>
          </Block>
        </Line>
      </Card>
      {touched.terms && !!errors.terms && (
        <ErrorLabel>{errors.terms}</ErrorLabel>
      )}
    </>
  );
};

export default Summary;

const Card = styled.div`
  margin: 48px 0;
  padding: 5px 25px;
  border: ${(props) =>
    props.isAccepted ? '1px solid #438945' : '1px solid #ccc'};
  box-shadow: ${(props) => (props.isAccepted ? '0 0 2px #438945' : 'none')};
  box-sizing: border-box;
  border-radius: 10px;
  line-height: 1.2;
  transition: all ease 0.1s;
  @media (max-width: 768px) {
    margin: 0;
  }
`;
const Line = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 1rem;
    :last-child{
      flex-direction: column-reverse;
    }
  }
`;
const Block = styled.div`
  width: 50%;
  font-size: 0.75rem;
  p {
    margin: 0;
  }
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    width: 80%;
  }
`;
const Name = styled.span`
  display: block;
  font-weight: 700;
  font-size: 1.05rem;
  min-height: 2.1rem;
`;
const Secondary = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  white-space: nowrap;
  display: block;
  font-weight: 400;
  opacity: 0.75;
`;
const Company = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
`;
const ProjectValue = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
`;
const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.75rem;
  opacity: ${(props) => (props.isAccepted ? 1 : 0.75)};
  color: ${(props) => (props.isAccepted ? '#438945' : '#000')};
  :hover {
    opacity: 1;
  }
  span {
    display: block;
  }
`;
const Checkbox = styled.input`
  display: block;
  height: 100%;
  margin-right: 10px;
`;