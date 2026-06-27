import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { apiUrls } from './constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const jwtToken = document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='));

  useEffect(() => {
    if (jwtToken) {
      navigate('/', { replace: true });
    }
  }, [jwtToken, navigate]);

  const submitForm = async event => {
    event.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setErrorMsg('Please enter both username and password');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const userDetails = { username, password };

    try {
      const response = await fetch(apiUrls.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });
      const data = await response.json();

      if (response.ok) {
        document.cookie = `jwt_token=${data.jwt_token}; path=/`;
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        navigate('/', { replace: true });
      } else {
        setErrorMsg(data.error_msg || `Login failed (${response.status})`);
      }
    } catch (error) {
      setErrorMsg(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-app-login-img.png"
          alt="login website logo"
          className="login-logo"
        />
        <form className="login-form" onSubmit={submitForm}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          {errorMsg && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
