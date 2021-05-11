import React, { useCallback, useState, useContext, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router';
import fire from '../Components/Firebase/firebase';
import { AuthContext } from '../Components/Firebase/auth';

const Login = ({ history }) => {
  const [Error, SetError] = useState('');

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    history.push('/');
  }

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;

        try {
          await fire
            .auth()
            .signInWithEmailAndPassword(email.value, password.value);
          history.push('/');
        } catch (error) {
          if (error.code === 'auth/wrong-password') {
            SetError('Ingevoerde gegevens komen niet overeen.');
          }
        }
      } 
    },
    [history]
  );

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className='content'>
        <label>Email</label>
        <input
          name='email'
          type='email'
          placeholder='Email'
          className='form-control'
        />
        <label style={{ marginTop: 10 }}>Wachtwoord</label>
        <input
          name='password'
          type='password'
          placeholder='Wachtwoord'
          className='form-control'
        />
        <button
          className='btn btn-success'
          style={{ marginTop: 15 }}
          type='submit'
        >
          Inloggen
        </button>
      </form>
    </>
  );
};

export default withRouter(Login);