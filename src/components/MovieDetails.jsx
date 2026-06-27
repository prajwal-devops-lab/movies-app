import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Loader from './Loader';
import { apiStatusConstants, apiUrls } from './constants';
import './MovieDetails.css';

const MovieDetails = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.initial);
  const [searchValue, setSearchValue] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const getJwtToken = () => document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='));

  const formatRuntime = runtime => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  const fetchMovieDetails = async () => {
    setStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`${apiUrls.movieDetails}/${id}`, {
        headers: { Authorization: `Bearer ${getJwtToken()?.split('=')[1] || ''}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setMovieDetails(data.movie_details);
      setSimilarMovies(data.movie_details.similar_movies || []);
      setStatus(apiStatusConstants.success);
    } catch {
      setStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="movie-details-route-container">
      <Header showSearch={false} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />
      <div className="movie-details-content">
        {status === apiStatusConstants.inProgress && <Loader type="clip" />}
        {status === apiStatusConstants.failure && (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view.png"
              alt="failure view"
              className="failure-image"
            />
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={fetchMovieDetails} className="try-again-button">
              Try Again
            </button>
          </div>
        )}
        {status === apiStatusConstants.success && movieDetails && (
          <div className="movie-details-card">
            <img src={movieDetails.backdrop_path} alt={movieDetails.title} className="details-backdrop" />
            <div className="details-text">
              <h2>{movieDetails.title}</h2>
              <p>{movieDetails.overview}</p>
              <p>Runtime: {formatRuntime(movieDetails.runtime)}</p>
              <p>Censor Rating: {movieDetails.adult ? 'A' : 'U/A'}</p>
              <div className="genres">
                {movieDetails.genres.map(genre => (
                  <span key={genre.id} className="genre-item">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="similar-movies-section">
              <h3>Similar Movies</h3>
              <ul className="movies-list">
                {similarMovies.map(movie => (
                  <li key={movie.id} onClick={() => navigate(`/movies/${movie.id}`)} className="movie-item">
                    <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
                    <p>{movie.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
