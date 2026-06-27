import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Account.css';

const Account = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
    setPassword(localStorage.getItem('password') || '');
  }, []);

  const handleLogout = () => {
    document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    navigate('/login', { replace: true });
  };

  return (
    <div className="account-route-container">
      <Header showSearch={false} searchValue="" setSearchValue={() => {}} onSearch={() => {}} />
      <div className="account-content">
        <h2>Account</h2>
        <div className="account-details">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Password:</strong> {'*'.repeat(password.length)}
          </p>
          <p>
            <strong>Plan:</strong> Premium
          </p>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
