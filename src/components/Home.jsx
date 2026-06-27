import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Loader from './Loader';
import { apiStatusConstants, apiUrls } from './constants';
import './Home.css';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [originalsMovies, setOriginalsMovies] = useState([]);
  const [trendingStatus, setTrendingStatus] = useState(apiStatusConstants.initial);
  const [originalsStatus, setOriginalsStatus] = useState(apiStatusConstants.initial);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const getJwtToken = () => document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='));

  const fetchTrending = async () => {
    setTrendingStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(apiUrls.trending, {
        headers: { Authorization: `Bearer ${getJwtToken()?.split('=')[1] || ''}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setTrendingMovies(data.results || []);
      setTrendingStatus(apiStatusConstants.success);
    } catch {
      setTrendingStatus(apiStatusConstants.failure);
    }
  };

  const fetchOriginals = async () => {
    setOriginalsStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(apiUrls.originals, {
        headers: { Authorization: `Bearer ${getJwtToken()?.split('=')[1] || ''}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setOriginalsMovies(data.results || []);
      setOriginalsStatus(apiStatusConstants.success);
    } catch {
      setOriginalsStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchTrending();
    fetchOriginals();
  }, []);

  const randomOriginal = originalsMovies[Math.floor(Math.random() * originalsMovies.length)];

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="home-route-container">
      <Header showSearch={false} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />
      <div className="home-content">
        {originalsStatus === apiStatusConstants.inProgress && <Loader />}
        {originalsStatus === apiStatusConstants.failure && (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view.png"
              alt="failure view"
              className="failure-image"
            />
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={fetchOriginals} className="try-again-button">
              Try Again
            </button>
          </div>
        )}
        {originalsStatus === apiStatusConstants.success && randomOriginal && (
          <div className="random-movie-card">
            <img src={randomOriginal.backdrop_path} alt={randomOriginal.title} className="random-movie-image" />
            <div className="random-movie-details">
              <h2>{randomOriginal.title}</h2>
              <p>{randomOriginal.overview}</p>
              <button type="button" onClick={() => navigate(`/movies/${randomOriginal.id}`)}>
                View Details
              </button>
            </div>
          </div>
        )}
        <section className="movies-section">
          <h2>Trending Now</h2>
          {trendingStatus === apiStatusConstants.inProgress && <Loader />}
          {trendingStatus === apiStatusConstants.failure && (
            <div className="failure-view">
              <img
                src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view.png"
                alt="failure view"
                className="failure-image"
              />
              <p>Something went wrong. Please try again</p>
              <button type="button" onClick={fetchTrending} className="try-again-button">
                Try Again
              </button>
            </div>
          )}
          {trendingStatus === apiStatusConstants.success && (
            <ul className="movies-list">
              {trendingMovies.map(movie => (
                <li key={movie.id} onClick={() => navigate(`/movies/${movie.id}`)} className="movie-item">
                  <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
