import React from 'react';
import styles from './PlanetsList.module.css';
import { useNavigate } from 'react-router-dom';

function PlanetList({planets}) {

  const navigate = useNavigate();

  const goPlanet = ({ planet, index }, e) => {
    e.preventDefault();
    console.log("Lista de planetas antes de navegar:", planet);
    if (planet !== undefined && planet !== null && index !== undefined && index !== null) {
      navigate('/planet', { state: { planet, index } });
    }
  }
  
  return (
    <div className={styles.PlanetsList}>
      {planets.map((planet, index) => (
        <div
          className={styles['unit-name-content']}
          key={index}
          onClick={(e) => goPlanet({ planet, index }, e)} // Adicione o evento onClick aqui
        >
          <p>{planet.name}</p>
        </div>
      ))}
    </div>
  );
}

export default PlanetList;
