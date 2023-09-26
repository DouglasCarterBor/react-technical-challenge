import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './PopulationRangeSlider.module.css';

function PopulationRangeSlider({ minValue, maxValue, onRangeChange }) {
  const [values, setValues] = useState([minValue, maxValue]);

  const onChange = (newValues) => {
    setValues(newValues);
    // Chama a função de retorno e passa os novos valores mínimos e máximos
    onRangeChange(newValues[0], newValues[1]);
  };

  return (
    <div className={styles.PopulationRangeSlider}>
      <Slider
        className={styles['rc-slider-handle']}
        range
        min={minValue}
        max={maxValue}
        step={1}
        value={values}
        onChange={onChange}
      />
      <p>Minimum: {values[0]}</p>
      <p>Maximum: {values[1]}</p>
    </div>
  );
}

export default PopulationRangeSlider;
