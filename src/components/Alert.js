import PropTypes from 'prop-types';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';

const AlertContext = React.createContext();
export const useAlert = () => React.useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = React.useState(null);
  return (
    <AlertContext.Provider value={setAlert}>
      {children}
      {alert && <Alert onClose={() => setAlert(null)}>{alert}</Alert>}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.any,
};

const Alert = ({ children, onClose, buttonText }) => (
  <ModalContainer>
    <OutsideClickHandler onOutsideClick={onClose}>
      <Container>
        <Header>
          <Body>{children}</Body>
        </Header>
        <ButtonContainer>
          <Button type='button' onClick={onClose}>
            {buttonText}
          </Button>
        </ButtonContainer>
      </Container>
    </OutsideClickHandler>
  </ModalContainer>
);
Alert.defaultProps = {
  buttonText: 'Ok',
};
Alert.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
  buttonText: PropTypes.string,
};

export default Alert;

const Container = styled.div`
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
const Body = styled.h3`
  font-size: 1rem;
  margin: 0;
  max-width: 350px;
  margin: 0 15px;
  margin-bottom: 2rem;
`;
