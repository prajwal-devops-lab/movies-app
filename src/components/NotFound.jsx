import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/movies-app-not-found-img.png"
        alt="not found"
        className="not-found-image"
      />
      <h2>Page Not Found</h2>
      <button type="button" className="home-button" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default NotFound;
