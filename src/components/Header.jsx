import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import './Header.css';

const Header = ({ showSearch, searchValue, setSearchValue, onSearch }) => {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <div className="logo-section" onClick={() => navigate('/')}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-app/movies-logo-img.png"
          alt="website logo"
          className="website-logo"
        />
        <h1 className="app-name">Movies</h1>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Home
        </NavLink>
        <NavLink to="/popular" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Popular
        </NavLink>
        <button type="button" className="search-button" data-testid="searchButton" onClick={() => navigate('/search')}>
          <HiOutlineSearch />
        </button>
      </nav>
      <button type="button" className="profile-button" onClick={() => navigate('/account')}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-app/profile-img.png"
          alt="profile"
          className="profile-logo"
        />
      </button>
      {showSearch && (
        <div className="search-input-wrapper">
          <input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search"
            className="search-input"
          />
          <button type="button" className="search-submit" data-testid="searchButton" onClick={onSearch}>
            <HiOutlineSearch />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
