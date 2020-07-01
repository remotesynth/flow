import React from 'react';

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

const handleSubmit = (e) => {
  e.preventDefault()
  const form = e.target
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({
      'form-name': form.getAttribute('name'),
      ...state,
    }),
  })
    .then(() => navigate(form.getAttribute('action')))
    .catch((error) => alert(error))
}


export default class StartForm extends React.Component {
    render() {
        return (
            <form name="startForm" method="POST" data-netlify-honeypot="bot-field" data-netlify="true" id="start-form" className="start-form" action="/signup/">
              <input type="hidden" name="form-name" value="startForm" />
              <div className="screen-reader-text">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </div>
              <div className="form-row">
                <label>
                  <span className="screen-reader-text">Email Comercial</span>
                  <input className="lead-email" type="email" required name="email" placeholder="Seu email comercial"/>
                </label>
              </div>
              <input type="hidden" name="form-name" value="startForm" />
              <button className="button" type="submit">Começar Agora</button>
            </form>
        );
    }
}

