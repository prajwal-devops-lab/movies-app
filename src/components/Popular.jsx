import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Loader from './Loader';
import { apiStatusConstants, apiUrls } from './constants';
import './Popular.css';

const Popular = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.initial);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const getJwtToken = () => document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='));

  const fetchPopular = async () => {
    setStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(apiUrls.popular, {
        headers: { Authorization: `Bearer ${getJwtToken()?.split('=')[1] || ''}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setPopularMovies(data.results || []);
      setStatus(apiStatusConstants.success);
    } catch {
      setStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="popular-route-container">
      <Header showSearch={false} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />
      <div className="popular-content">
        {status === apiStatusConstants.inProgress && <Loader />}
        {status === apiStatusConstants.failure && (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view.png"
              alt="failure view"
              className="failure-image"
            />
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={fetchPopular} className="try-again-button">
              Try Again
            </button>
          </div>
        )}
        {status === apiStatusConstants.success && (
          <ul className="movies-list">
            {popularMovies.map(movie => (
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

export default Popular;
