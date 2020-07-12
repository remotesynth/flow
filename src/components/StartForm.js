import React, { useState } from 'react';
import { navigate } from 'gatsby';

const StartForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    fetch(
      'https://hooks.zapier.com/hooks/catch/142211/ozo0et4/',
      requestOptions
    )
      .then(() => navigate('signup', { state: { email } }))
      .catch((error) => console.log('error', error));
  };

  return (
    <form
      name='startForm'
      data-netlify-honeypot='bot-field'
      data-netlify='true'
      id='start-form'
      className='start-form'
      onSubmit={handleSubmit}
    >
      <input type='hidden' name='form-name' value='startForm' />
      <div className='screen-reader-text'>
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name='bot-field' />
        </label>
      </div>
      <div className='form-row'>
        <label>
          <span className='screen-reader-text'>Email Comercial</span>
          <input
            className='lead-email'
            type='email'
            required
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Seu email comercial'
          />
        </label>
      </div>
      <input type='hidden' name='form-name' value='startForm' />
      <button className='button' type='submit'>
        Começar Agora
      </button>
    </form>
  );
};

export default StartForm;
