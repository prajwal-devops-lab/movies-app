import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Loader from './Loader';
import { apiStatusConstants, apiUrls } from './constants';
import './Search.css';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.initial);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getJwtToken = () => document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='));

  const fetchSearchResults = async query => {
    setStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`${apiUrls.search}?search=${query}`, {
        headers: { Authorization: `Bearer ${getJwtToken()?.split('=')[1] || ''}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setSearchResults(data.results || []);
      setSearchTerm(query);
      setStatus(apiStatusConstants.success);
    } catch {
      setStatus(apiStatusConstants.failure);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      fetchSearchResults(searchInput.trim());
    }
  };

  return (
    <div className="search-route-container">
      <Header
        showSearch
        searchValue={searchInput}
        setSearchValue={setSearchInput}
        onSearch={handleSearch}
      />
      <div className="search-content">
        {status === apiStatusConstants.inProgress && <Loader />}
        {status === apiStatusConstants.failure && (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view.png"
              alt="failure view"
              className="failure-image"
            />
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={() => fetchSearchResults(searchInput.trim())} className="try-again-button">
              Try Again
            </button>
          </div>
        )}
        {status === apiStatusConstants.success && searchResults.length === 0 && (
          <div className="no-results-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/movies-app/no-movies.png"
              alt="no movies"
              className="no-results-image"
            />
            <p>Your search for {searchTerm} did not find any matches.</p>
          </div>
        )}
        {status === apiStatusConstants.success && searchResults.length > 0 && (
          <ul className="movies-list">
            {searchResults.map(movie => (
              <li key={movie.id} onClick={() => navigate(`/movies/${movie.id}`)} className="movie-item">
                <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
                <p>{movie.title}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
