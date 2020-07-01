import React from 'react';

export default class StartForm extends React.Component {
    render() {
        return (
            <form name="startForm" method="POST" data-netlify-honeypot="bot-field" data-netlify="true" id="start-form" className="start-form">
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

