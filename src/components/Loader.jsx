import { BeatLoader, ClipLoader } from 'react-spinners';
import './Loader.css';

const Loader = ({ type }) => (
  <div className="loader-container" data-testid="loader">
    {type === 'clip' ? (
      <ClipLoader color="#D81F26" size={50} />
    ) : (
      <BeatLoader color="#D81F26" size={15} />
    )}
  </div>
);

export default Loader;
