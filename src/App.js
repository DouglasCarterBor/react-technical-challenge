import styles from './App.module.css';
import Footer from './components/Footer';
import PlanetSearch from './components/pages/PlanetSearchPage';
import StarWarsLogo from './components/StarWarsLogo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlanetPage from './components/pages/PlanetPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <div className={styles.App}>
        <div className={styles['main-content']}>
          <div className={styles['second-content']}>
            <StarWarsLogo />
            <Routes>
              <Route exact path="/" element={<PlanetSearch />} />
              <Route path="/planet" element={<PlanetPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
