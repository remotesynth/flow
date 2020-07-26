import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import firebase from 'gatsby-plugin-firebase';
import { Loader } from './OnboardingComponents/Loader';
import styled from 'styled-components';
import get from 'lodash/get';
import { formatCurrency } from './OnboardingComponents/ProjectValueInput';
import { sendFirebaseSignInEmail } from './OnboardingComponents/onboarding.requests';
import { navigate } from 'gatsby';

const Dashboard = (props) => {
  const [deals, setDeals] = useState(null);
  const unsubscribeAuth = useRef(null);
  useEffect(() => {
    unsubscribeAuth.current = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          user = await authenticate();
        }
        if (user) {
          const deals = await getDeals(user);
          if(deals.length<1){
            document.getElementById('deal-msg').style.display = 'block';
          }else{
            document.getElementById('deal-msg').style.display = 'none';
          }
          setDeals(deals);
        } else {
          setDeals([]);
        }
      });
    return unsubscribeAuth.current;
  }, []);

  const signOut = () => {
    unsubscribeAuth.current();
    firebase.auth().signOut();
    navigate('/');
  };


  return (
    <>
      <Card>
        <div id="deal-msg" style={{display: 'none'}}> Por favor aguarde um momento, estamos processando as informações enviadas </div>
        {deals ? (
          deals.map((deal) => (
            <Deal key={deal.id}>
              <DealHeader>
                <DealName>{get(deal, 'deal_name', '')}</DealName>
                <DealValue>
                  R$ {formatCurrency(get(deal, 'deal_value', ''))}
                </DealValue>
              </DealHeader>
              <DealRow>
                <CalendarIcon />
                <span>{get(deal, 'update_date_i18n.pt', '')}</span>
              </DealRow>
              <DealRow>
                <DescriptionIcon />
                <span>{get(deal, 'project_desc', '---')}</span>
              </DealRow>
              <DealStatus status={get(deal, 'deal_stage', '---')} />
            </Deal>
          ))
        ) : (
          <Loader centered />
        )}
      </Card>
      <ClientOnly>
        <AuthMenu signOut={signOut} />
      </ClientOnly>
    </>
  );
};

export default Dashboard;

const AuthMenu = (props) => (
  <Row>
    <span>
      Email cadastrado: <b>{get(firebase.auth(), 'currentUser.email', '...')}</b>
    </span>
    <button onClick={props.signOut}>Sair</button>
  </Row>
);

AuthMenu.propTypes = {
  signOut: PropTypes.func.isRequired,
};

export const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted ? children : null;
};

const getDeals = async (user) => {
  const db = firebase.firestore();
  const snapshot = await db
    .collection('Deals')
    .where('deal_email', '==', user?.email)
    .get();
  const deals = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return deals;
};

const authenticate = () => {
  let email = window.localStorage.getItem('emailForSignIn');
  // let usrFirstName = window.localStorage.getItem('usrfirstName');
  // let usrLastName = window.localStorage.getItem('usrlastName');
  // let usrPhone = window.localStorage.getItem('usrPhone');
  // console.log('usr data == ', usrFirstName, usrLastName, usrPhone);

  firebase.auth().fetchSignInMethodsForEmail(email).then((signInMethods) => {
    if (signInMethods.length === 0) {
      // New user

      console.log('NEW USER!!')


    } else {
      // Existing user

      console.log('NEW USER!!')


    }
  });


  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    if (!email) {
      email = window.prompt('Por favor informe seu email para confirmação');
    }
    return firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then((resp) => resp.user )
      .catch(async (error) => {
        if (error.code === 'auth/invalid-action-code') {
          window.localStorage.removeItem('emailForSignIn');
          const newEmail = window.prompt(
            'Link de acesso expirou para sua segurança. Por favor informe seu email para receber um novo link',
            email
          );
          await sendFirebaseSignInEmail(newEmail);
          alert('Enviamos um email com um link direto para acessar o seu Dashboard');
          navigate('/');
        }
      });
  } else {
    email = window.prompt('Por favor informe seu email');
    sendFirebaseSignInEmail(email);
    alert('Enviamos um email com um link direto para acessar o seu Dashboard');
    navigate('/');
  }
};

const Card = styled.div`
  background: white;
  box-shadow: 0 2px 3px #ccc;
  border-radius: 5px;
  min-height: 100px;
  margin-bottom: 2rem;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  button {
    white-space: nowrap;
  }
  span {
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const CardHeader = styled.h3`
  padding: 15px 30px;
  box-sizing: border-box;
  margin: 0;
  font-weight: 400;
  font-size: 1.2rem;
  color: #666;
  width: 100%;
`;
const Deal = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #ddd;
`;
const DealHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const DealName = styled.p`
  margin: 10px 0;
  width: 40%;
  font-weight: 700;
  line-height: 1.1rem;
  font-size: 1rem;
`;
const DealValue = styled.p`
  margin: 10px 0;
  width: 60%;
  font-weight: 700;
  line-height: 1.1rem;
  text-align: right;
`;
const DealRow = styled.p`
  margin: 10px 0;
  color: #888;
  display: flex;
  align-items: center;
`;
const DealStatus = ({ status }) => {
  const entries = Object.entries(STATUSES);
  return (
    <StatusStepperContainer>
      {entries.map(([key, label], index) => (
        <React.Fragment key={key}>
          <Step $step={key} $isCurrent={status == key}>
            <StepIcon $isComplete={key < status} $isCurrent={status == key}>
              {index + 1}
            </StepIcon>
            <StepName $isCurrent={status == key}>{label}</StepName>
          </Step>
          {index + 1 != entries.length && (
            <StepTrail
              $isBold={index < Object.keys(STATUSES).indexOf(status)}
            />
          )}
        </React.Fragment>
      ))}
    </StatusStepperContainer>
  );
};
DealStatus.propTypes = {
  status: PropTypes.string.isRequired,
};
const StatusStepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 2rem 1rem 1rem 1rem;
  min
`;
const Step = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  max-width: 1.5rem;
`;
const StepName = styled.div`
  line-height: 1;
  text-align: center;
  color: ${(props) => (props.$isCurrent ? 'black' : '#888')};
  font-weight: ${(props) => (props.$isCurrent ? '700' : '400')};
  @media (max-width: 768px) {
    display: ${(props) => (props.$isCurrent ? 'block' : 'none')};
  }
`;
const StepIcon = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  margin-bottom: 0.25rem;
  display: grid;
  place-items: center;
  font-weight: ${(props) => (props.$isCurrent ? '700' : '400')};
  cursor: ${(props) => (props.$isComplete ? 'pointer' : 'default')};
  border: 1px solid #438945;
  border-radius: 50%;
  color: ${(props) => (props.$isCurrent ? 'white' : '#438945')};
  background: ${(props) =>
    props.$isCurrent ? 'linear-gradient(to right, #438945, #73bb75)' : 'none'};
`;
const StepTrail = styled.div`
  margin-bottom: 6px;
  border-radius: 2px;
  background: #438945;
  opacity: ${(props) => (props.$isBold ? 1 : 0.7)};
  width: 8vw;
  height: ${(props) => (props.$isBold ? '3px' : '1px')};
  align-self: flex-start;
  margin-top: 0.75rem;
  flex-grow: 0;
`;

const Icon = styled.svg`
  width: 22px;
  fill: #888;
  display: inline-block;
  margin-right: 0.5rem;
`;
const CalendarIcon = () => (
  <Icon viewBox='0 0 524 524' xmlns='http://www.w3.org/2000/svg'>
    <path d='m446 40h-46v-24c0-8.836-7.163-16-16-16s-16 7.164-16 16v24h-224v-24c0-8.836-7.163-16-16-16s-16 7.164-16 16v24h-46c-36.393 0-66 29.607-66 66v340c0 36.393 29.607 66 66 66h380c36.393 0 66-29.607 66-66v-340c0-36.393-29.607-66-66-66zm-380 32h46v16c0 8.836 7.163 16 16 16s16-7.164 16-16v-16h224v16c0 8.836 7.163 16 16 16s16-7.164 16-16v-16h46c18.748 0 34 15.252 34 34v38h-448v-38c0-18.748 15.252-34 34-34zm380 408h-380c-18.748 0-34-15.252-34-34v-270h448v270c0 18.748-15.252 34-34 34z' />
  </Icon>
);
const DescriptionIcon = () => (
  <Icon viewBox='0 0 512.00031 512' xmlns='http://www.w3.org/2000/svg'>
    <path d='m306.753906 186.6875h-93.34375c-7.773437 0-14.261718 5.945312-14.941406 13.691406l-8.167969 93.347656c-.367187 4.191407 1.042969 8.339844 3.882813 11.441407 2.84375 3.101562 6.855468 4.863281 11.0625 4.863281h93.34375c7.777344 0 14.265625-5.941406 14.945312-13.691406l8.164063-93.34375c.367187-4.191406-1.042969-8.339844-3.882813-11.441406-2.84375-3.101563-6.855468-4.867188-11.0625-4.867188zm-21.910156 93.347656h-63.230469l5.542969-63.347656h63.230469zm0 0' />
    <path d='m454.550781 216.6875c14.160157 0 27.886719-5.453125 38.652344-15.351562 10.75-9.882813 17.351563-23.109376 18.585937-37.234376 1.28125-14.65625-3.304687-28.503906-12.914062-38.992187-9.578125-10.453125-22.902344-16.207031-37.550781-16.207031h-53.605469l4.695312-53.699219c1.285157-14.660156-3.300781-28.507813-12.914062-38.996094-9.574219-10.449219-22.898438-16.207031-37.515625-16.207031-14.160156 0-27.886719 5.453125-38.652344 15.351562-10.75 9.882813-17.351562 23.105469-18.585937 37.234376l-4.929688 56.316406h-63.230468l4.699218-53.703125c1.28125-14.65625-3.304687-28.503907-12.914062-38.996094-9.578125-10.449219-22.902344-16.203125-37.519532-16.203125-14.160156 0-27.886718 5.449219-38.652343 15.347656-10.75 9.886719-17.347657 23.109375-18.585938 37.238282l-4.925781 56.3125h-56.265625c-14.160156 0-27.886719 5.453124-38.652344 15.351562-10.75 9.886719-17.351562 23.109375-18.585937 37.238281-1.28125 14.65625 3.308594 28.507813 12.917968 38.996094 9.578126 10.449219 22.898438 16.203125 37.515626 16.203125h53.636718l-5.542968 63.347656h-56.261719c-14.160157 0-27.886719 5.449219-38.652344 15.347656-10.75 9.886719-17.347656 23.109376-18.585937 37.234376-1.28125 14.660156 3.304687 28.507812 12.917968 38.996093 9.574219 10.449219 22.898438 16.203125 37.515625 16.203125h53.640625l-4.699218 53.703125c-1.28125 14.65625 3.304687 28.503907 12.917968 38.996094 9.574219 10.449219 22.898438 16.203125 37.515625 16.203125 14.160157 0 27.886719-5.449219 38.648438-15.347656 10.753906-9.886719 17.355469-23.109375 18.589843-37.234375.007813-.074219.015626-.148438.019532-.222657l4.90625-56.097656 63.230468.003906-4.695312 53.695313c-1.285156 14.660156 3.304688 28.507813 12.914062 38.996094 9.574219 10.453125 22.898438 16.207031 37.515626 16.207031 14.160156 0 27.886718-5.449219 38.652343-15.347656 10.75-9.886719 17.351563-23.109375 18.589844-37.238282.003906-.042968.007813-.089843.011719-.136718l4.914062-56.175782h56.265625c.117188 0 .234375 0 .351563-.003906 14.035156-.089844 27.625-5.53125 38.300781-15.347656 10.75-9.886719 17.351563-23.109375 18.585937-37.234375 1.28125-14.65625-3.304687-28.503906-12.917968-38.996094-9.574219-10.449219-22.898438-16.203125-37.546875-16.203125h-53.609375l5.542968-63.347656zm-89.238281 88.480469c2.84375 3.101562 6.855469 4.867187 11.0625 4.867187h70.007812c6.105469 0 11.574219 2.296875 15.402344 6.472656 3.859375 4.214844 5.6875 9.933594 5.148438 16.109376-1.195313 13.660156-13.722656 25.199218-27.355469 25.199218-.097656 0-.195313.003906-.296875.003906h-69.710938c-7.777343 0-14.265624 5.945313-14.941406 13.691407l-6.125 69.976562c0 .042969-.003906.082031-.007812.121094-1.246094 13.621094-13.746094 25.109375-27.347656 25.109375-6.105469 0-11.574219-2.296875-15.398438-6.472656-3.859375-4.214844-5.691406-9.9375-5.148438-16.113282l6.125-70.003906c.367188-4.191406-1.042968-8.339844-3.882812-11.441406-2.84375-3.101562-6.855469-4.867188-11.0625-4.867188l-93.34375-.003906c-7.777344 0-14.265625 5.945313-14.941406 13.695313l-6.121094 69.976562c-.007812.0625-.011719.121094-.015625.179688-1.273437 13.59375-13.761719 25.054687-27.339844 25.054687-6.105469 0-11.574219-2.300781-15.402343-6.476562-3.859376-4.210938-5.6875-9.933594-5.144532-16.113282l6.125-70.007812c.367188-4.1875-1.042968-8.339844-3.882812-11.441406-2.84375-3.097656-6.855469-4.863282-11.0625-4.863282h-70.007813c-6.105469 0-11.574219-2.300781-15.398437-6.472656-3.859375-4.214844-5.691406-9.9375-5.148438-16.113281 1.195313-13.660156 13.71875-25.199219 27.351563-25.199219h70.007812c7.777344 0 14.265625-5.945312 14.941407-13.691406l8.167968-93.347656c.367188-4.1875-1.042968-8.339844-3.882812-11.441406-2.839844-3.097657-6.855469-4.863282-11.058594-4.863282h-70.007812c-6.105469 0-11.574219-2.300781-15.398438-6.472656-3.859375-4.214844-5.691406-9.9375-5.148438-16.113281 1.195313-13.664063 13.722657-25.203125 27.351563-25.203125h70.007813c7.777343 0 14.265624-5.945313 14.941406-13.691406l6.128906-70.007813c1.195312-13.660156 13.71875-25.199219 27.351562-25.199219 6.105469 0 11.574219 2.296875 15.398438 6.472656 3.859375 4.210938 5.691406 9.933594 5.148438 16.109376l-6.125 70.007812c-.367188 4.191406 1.042968 8.34375 3.882812 11.441406 2.839844 3.101563 6.855469 4.867188 11.058594 4.867188h93.34375c7.777344 0 14.265625-5.945313 14.945312-13.691406l6.125-70.007813c1.195313-13.660156 13.722656-25.199219 27.355469-25.199219 6.101563 0 11.574219 2.296875 15.398437 6.472656 3.859376 4.210938 5.6875 9.933594 5.148438 16.109376l-6.125 70.007812c-.367188 4.191406 1.042969 8.339844 3.882812 11.441406 2.839844 3.101563 6.851563 4.867188 11.058594 4.867188h70.011719c6.101563 0 11.570313 2.300781 15.394531 6.472656 3.863282 4.214844 5.691406 9.9375 5.148438 16.113281-1.191406 13.664063-13.71875 25.203125-27.351563 25.203125h-70.011719c-7.773437 0-14.261718 5.945313-14.941406 13.691406l-8.167968 93.347657c-.367188 4.1875 1.042968 8.335937 3.882812 11.4375zm0 0' />
  </Icon>
);

const STATUSES = {
  appointmentscheduled: 'Em análise',
  qualifiedtobuy: 'Crédito aprovado',
  contractsent: 'Contrato enviado',
  closedwon: 'Contrato assinado'
 // closedlost: 'Solicitação cancelada'
};
