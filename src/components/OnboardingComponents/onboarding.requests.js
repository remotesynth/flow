import { stripCurrency } from './ProjectValueInput';
import firebase from 'gatsby-plugin-firebase';
import { nanoid } from 'nanoid';

export const sendDataToZapier = async (values, firebaseUid) => {
  const formData = new FormData();
  formData.append('firebaseUid', firebaseUid);
  formData.append('email', values.email);
  formData.append('firstName', values.firstName);
  formData.append('lastName', values.lastName);
  formData.append('userType', values.userType);
  formData.append('phone', values.phone);
  formData.append('projectValue', stripCurrency(values.projectValue));
  formData.append('projectDescription', values.projectDescription);
  formData.append('cnpj', values.cnpj.replace(/\D/g, ''));
  formData.append('companyName', values.company.name);
  formData.append('companyFoundedDate', values.company.founded);
  formData.append('companyPhone', values.company.phone);
  formData.append('companyAddress', JSON.stringify(values.company.address));
  formData.append(
    'companyPrimaryActivity',
    JSON.stringify(values.company.primary_activity)
  );
  formData.append(
    'companyLegalNature',
    JSON.stringify(values.company.legal_nature)
  );
  const requestOptions = {
    method: 'POST',
    body: formData,
    redirect: 'follow',
  };

  const resp = await fetch(
    'https://hooks.zapier.com/hooks/catch/142211/ozon6ju/',
    requestOptions
  );
  const data = await resp.json();
  console.log('Zapier hook response: ', data);
  return data;
};

/**
 *
 * @param {string} email
 */
export const sendFirebaseSignInEmail = (email) => {
  const actionCodeSettings = {
    // URL you want to redirect back to
    url: `${window.location.origin}/dashboard`,
    // This must be true.
    handleCodeInApp: true,
  };
  return firebase
    .auth()
    .sendSignInLinkToEmail(email, actionCodeSettings)
    .then(function () {
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch(function (error) {
      console.error(error);
    });
};
window.firebase = firebase;
/**
 * @param {string} email
 * @param {*} values
 */
export const createUser = async (email, values) => {
  const userSnapshot = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, nanoid());
  const db = firebase.firestore();
  await db.collection('Users').doc(userSnapshot.user.uid).set({
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
  });
  return userSnapshot;
};
