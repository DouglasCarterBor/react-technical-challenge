import style from "./PlanetSearchPage.module.css";
import SpaceShip from "../../assets/spaceship.webp";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlanetList from '../PlanetsList';
import PopulationRangeSlider from '../PopulationRangeSlider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PlanetSearch() {

    const [planets, setPlanets] = useState([]);
    const [filteredPlanets, setFilteredPlanets] = useState([]);
    const [showPlanetList, setShowPlanetList] = useState(false);
    const [showRangeSlider, setShowRangeSlider] = useState(false);
    const [minPopulation, setMinPopulation] = useState(0);
    const [maxPopulation, setMaxPopulation] = useState(0);

    const [searchValue, setSearchValue] = useState('');
    const [mostMatchedName, setMostMatchedName] = useState('');

    const [filtersActivated, setfiltersActivated] = useState(false);


    const changeShowRangeSlider = () => {
        if (showPlanetList) {
            setShowPlanetList(false);
        }
        if (!showRangeSlider) {
            setShowRangeSlider(true);
        } else {
            setShowRangeSlider(false);
        }
        verifyActivateFilters();
    }

    const changeShowPlanetList = () => {
        if (showRangeSlider) {
            setShowRangeSlider(false);
        }
        if (!showPlanetList) {
            setShowPlanetList(true);
        } else {
            setShowPlanetList(false);
        }
        verifyActivateFilters();
    }



    const verifyActivateFilters = () => {
        if (showRangeSlider) {
            setfiltersActivated(true);
        } else {
            setfiltersActivated(false);
        }
    }

    const handleRangeChange = (newMin, newMax) => {

        const filteredPlanets = planets.filter((planet) => {
            return planet.population >= newMin && planet.population <= newMax;
        });

        setFilteredPlanets(filteredPlanets);
    };



    const notify = ({ message }) => {
        toast(message);
    }


    const handleSearch = (e) => {
        e.preventDefault();

        verifyActivateFilters();

        if (!searchValue) {
            setMostMatchedName('');
            return;
        }

        let highestMatch = 0;
        let matchedName = '';

        const planetsToSearch = filtersActivated ? filteredPlanets : planets;

        planetsToSearch.forEach((planet) => {
            const name = planet.name;
            const match = calculateSimilarity(name, searchValue);

            if (match > highestMatch) {
                highestMatch = match;
                matchedName = name;
            }
        });

        setMostMatchedName(matchedName);

        const matchingPlanet = planetsToSearch.find((planet) => planet.name === mostMatchedName);
        if (matchingPlanet) {
            const index = planetsToSearch.indexOf(matchingPlanet);

            goPlanet({ planet: matchingPlanet, index: index }, e);
        } else {
            notify({ message: "There are no results for this search" });
        }
    };



    const calculateSimilarity = (str1, str2) => {
        const matrix = [];
        const lenStr1 = str1.length;
        const lenStr2 = str2.length;

        for (let i = 0; i <= lenStr1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= lenStr2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= lenStr1; i++) {
            for (let j = 1; j <= lenStr2; j++) {
                const cost = str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const levenshteinDistance = matrix[lenStr1][lenStr2];
        const maxLength = Math.max(lenStr1, lenStr2);
        const similarity = 1 - levenshteinDistance / maxLength;

        return similarity;
    };


    useEffect(() => {
        async function fetchPlanets() {
            try {
                const response = await axios.get('https://swapi.dev/api/planets/');
                setPlanets(response.data.results);

                const populations = response.data.results.map((planet) =>
                    parseInt(planet.population.replace(/,/g, '')) || 0
                );
                const minPop = Math.min(...populations);
                const maxPop = Math.max(...populations);
                setMinPopulation(minPop);
                setMaxPopulation(maxPop);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        }

        fetchPlanets();
    }, []);

    const navigate = useNavigate();


    const goPlanet = ({ planet, index }, e) => {
        e.preventDefault();
        console.log("Lista de planetas antes de navegar:", planets);
        if (planet !== undefined && planet !== null && index !== undefined && index !== null) {
            navigate('/planet', { state: { planet, index } });
        }
    }

    return (
        <div className={style.PlanetSearch}>
            <div className={style["main-content"]}>
                <div className={style["space-planet"]}></div>
                <div className={style["content-search-planet"]}>
                    <p>Discover all the information about Planets of the Star Wars Saga</p>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Enter the name in the planet"></input>
                    <button onClick={(e) => handleSearch(e)}>
                        <svg
                            className={style["search-icon"]}
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"

                        >
                            <path
                                d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M15.75 15.75L12.4875 12.4875"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        Search</button>

                    <div className={style["filter-container"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15.233" height="15.248" viewBox="0 0 16 16" fill="none" className={style["filter-icon"]}>
                            <path d="M0.476038 2.6928H7.72386C7.94231 3.68709 8.83024 4.43355 9.88918 4.43355C10.9481 4.43355 11.8361 3.68712 12.0545 2.6928H14.7572C15.0201 2.6928 15.2332 2.47965 15.2332 2.21676C15.2332 1.95387 15.0201 1.74072 14.7572 1.74072H12.0543C11.8354 0.746933 10.9463 0 9.88918 0C8.83154 0 7.94281 0.746814 7.72404 1.74072H0.476038C0.213146 1.74072 0 1.95387 0 2.21676C0 2.47965 0.213146 2.6928 0.476038 2.6928ZM8.62453 2.21801C8.62453 2.21631 8.62456 2.21459 8.62456 2.21289C8.62664 1.51767 9.19393 0.952106 9.88918 0.952106C10.5835 0.952106 11.1508 1.5169 11.1538 2.21179L11.1539 2.21878C11.1528 2.9152 10.5859 3.4815 9.88918 3.4815C9.1928 3.4815 8.62607 2.91576 8.6245 2.21976L8.62453 2.21801ZM14.7572 12.5551H12.0543C11.8354 11.5614 10.9463 10.8144 9.88918 10.8144C8.83154 10.8144 7.94281 11.5613 7.72404 12.5551H0.476038C0.213146 12.5551 0 12.7683 0 13.0312C0 13.2941 0.213146 13.5072 0.476038 13.5072H7.72386C7.94231 14.5015 8.83024 15.248 9.88918 15.248C10.9481 15.248 11.8361 14.5015 12.0545 13.5072H14.7572C15.0201 13.5072 15.2332 13.2941 15.2332 13.0312C15.2332 12.7683 15.0201 12.5551 14.7572 12.5551ZM9.88918 14.2959C9.1928 14.2959 8.62607 13.7302 8.6245 13.0342L8.62453 13.0324C8.62453 13.0307 8.62456 13.029 8.62456 13.0273C8.62664 12.3321 9.19393 11.7665 9.88918 11.7665C10.5835 11.7665 11.1508 12.3313 11.1538 13.0262L11.1539 13.0331C11.1529 13.7296 10.5859 14.2959 9.88918 14.2959ZM14.7572 7.14795H7.50935C7.29091 6.15365 6.40298 5.40723 5.34403 5.40723C4.28509 5.40723 3.39716 6.15365 3.17871 7.14795H0.476038C0.213146 7.14795 0 7.36109 0 7.62399C0 7.88691 0.213146 8.10002 0.476038 8.10002H3.17895C3.39784 9.09378 4.28696 9.84074 5.34403 9.84074C6.40167 9.84074 7.2904 9.0939 7.50917 8.10002H14.7572C15.0201 8.10002 15.2332 7.88691 15.2332 7.62399C15.2332 7.36109 15.0201 7.14795 14.7572 7.14795ZM6.60869 7.62274C6.60869 7.62446 6.60866 7.62616 6.60866 7.62785C6.60657 8.32308 6.03929 8.88864 5.34403 8.88864C4.64976 8.88864 4.08244 8.32385 4.07944 7.62898L4.07935 7.62202C4.08039 6.92552 4.64732 6.3593 5.34403 6.3593C6.04042 6.3593 6.60714 6.92501 6.60872 7.62104L6.60869 7.62274Z" fill="white" />
                        </svg>
                        <p>Filter:</p>
                        <div className={style["name-container"]} onClick={() => changeShowPlanetList()}>
                            <svg className={`${showPlanetList ? style['rotate-svg'] : ''}`} xmlns="http://www.w3.org/2000/svg" width="7" height="5" viewBox="0 0 7 5" fill="none">
                                <path d="M7.15841e-06 0.490983C-0.000288481 0.426739 0.00951863 0.363053 0.0288672 0.303578C0.0482159 0.244103 0.076725 0.190008 0.11276 0.144395C0.148904 0.0986408 0.191905 0.0623251 0.239284 0.0375422C0.286663 0.0127594 0.337481 -1.87935e-07 0.388807 -1.86487e-07C0.440134 -1.85039e-07 0.490952 0.0127594 0.538331 0.0375423C0.58571 0.0623251 0.628711 0.0986408 0.664855 0.144395L3.49921 3.70791L6.33356 0.144395C6.40677 0.0524738 6.50607 0.0008333 6.60961 0.000833303C6.66088 0.000833305 6.71164 0.0135111 6.75901 0.0381434C6.80637 0.0627758 6.84941 0.0988801 6.88566 0.144395C6.92191 0.189909 6.95066 0.243943 6.97028 0.303411C6.9899 0.362878 7 0.426616 7 0.490983C7 0.620979 6.95887 0.745651 6.88566 0.837572L3.77526 4.74279C3.73911 4.78855 3.69611 4.82486 3.64873 4.84965C3.60135 4.87443 3.55053 4.88719 3.49921 4.88719C3.44788 4.88719 3.39706 4.87443 3.34968 4.84965C3.30231 4.82486 3.2593 4.78855 3.22316 4.74279L0.11276 0.837571C0.076725 0.791958 0.0482159 0.737863 0.0288673 0.678388C0.00951863 0.618913 -0.00028848 0.555227 7.15841e-06 0.490983Z" fill="white" />
                            </svg>
                            <p>Name</p>

                        </div>
                        <div className={style["population-container"]} onClick={() => changeShowRangeSlider()}>
                            <svg className={`${showRangeSlider ? style['rotate-svg'] : ''}`} xmlns="http://www.w3.org/2000/svg" width="7" height="5" viewBox="0 0 7 5" fill="none">
                                <path d="M7.15841e-06 0.490983C-0.000288481 0.426739 0.00951863 0.363053 0.0288672 0.303578C0.0482159 0.244103 0.076725 0.190008 0.11276 0.144395C0.148904 0.0986408 0.191905 0.0623251 0.239284 0.0375422C0.286663 0.0127594 0.337481 -1.87935e-07 0.388807 -1.86487e-07C0.440134 -1.85039e-07 0.490952 0.0127594 0.538331 0.0375423C0.58571 0.0623251 0.628711 0.0986408 0.664855 0.144395L3.49921 3.70791L6.33356 0.144395C6.40677 0.0524738 6.50607 0.0008333 6.60961 0.000833303C6.66088 0.000833305 6.71164 0.0135111 6.75901 0.0381434C6.80637 0.0627758 6.84941 0.0988801 6.88566 0.144395C6.92191 0.189909 6.95066 0.243943 6.97028 0.303411C6.9899 0.362878 7 0.426616 7 0.490983C7 0.620979 6.95887 0.745651 6.88566 0.837572L3.77526 4.74279C3.73911 4.78855 3.69611 4.82486 3.64873 4.84965C3.60135 4.87443 3.55053 4.88719 3.49921 4.88719C3.44788 4.88719 3.39706 4.87443 3.34968 4.84965C3.30231 4.82486 3.2593 4.78855 3.22316 4.74279L0.11276 0.837571C0.076725 0.791958 0.0482159 0.737863 0.0288673 0.678388C0.00951863 0.618913 -0.00028848 0.555227 7.15841e-06 0.490983Z" fill="white" />
                            </svg>
                            <p>Population</p>
                        </div>
                    </div>

                    {showPlanetList && (
                        <PlanetList planets={planets} onClose={() => setShowPlanetList(false)} />
                    )}
                    {showRangeSlider && (
                        <PopulationRangeSlider
                            minValue={minPopulation}
                            maxValue={maxPopulation}
                            onRangeChange={handleRangeChange}
                        />
                    )}
                </div>
            </div>
            <img src={SpaceShip} alt="Space Ship"></img>
        </div>
    );
}

export default PlanetSearch;
