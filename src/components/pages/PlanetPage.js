import style from './PlanetPage.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { formatDescription } from '../utils';
import { addSpacesToEveryThreeCharacters } from '../utils';



function PlanetPage() {

    const location = useLocation();
    const planet = location.state.planet || [];
    const indexImage = location.state.index || 0;
    const navigate = useNavigate();

    const [formattedFilmList, setFormattedFilmList] = useState('');
    const [filmList, setFilmList] = useState([]);
    const [nofilms, setNoFilms] = useState(false);

    const [formattedResidentList, setFormattedResidentList] = useState('');
    const [noResident, setNoResident] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [planetName, setPlanetName] = useState(planet && planet.name ? planet.name : "");

    const inputRef = useRef(null);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setPlanetName(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };


    const goBack = () => {
        navigate('/');
    }

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (planet.films && planet.films.length > 0) {
            const fetchFilmTitles = async () => {
                const titles = await Promise.all(
                    planet.films.map(async (filmUrl) => {
                        try {
                            const response = await axios.get(filmUrl);
                            return response.data.title;
                        } catch (error) {
                            console.error('Erro ao buscar detalhes do filme:', error);
                            return '';
                        }
                    })
                );
                const formattedList = formatDescription(titles);
                setFilmList(titles);
                setFormattedFilmList(formattedList);
            };

            fetchFilmTitles();
        } else {
            setNoFilms(true);
        }

        if (planet.residents && planet.residents.length > 0) {
            const fetchResidentNames = async () => {
                const names = await Promise.all(
                    planet.residents.map(async (residentUrl) => {
                        try {
                            const response = await axios.get(residentUrl);
                            return response.data.name;
                        } catch (error) {
                            console.error('Erro ao buscar detalhes do residente:', error);
                            return '';
                        }
                    })
                );
                const formattedList = formatDescription(names);
                setFormattedResidentList(formattedList);
            };

            fetchResidentNames();
        } else {
            setNoResident(true);
        }
    }, [planet.films, planet.residents,]);



    const urlsPlanets = [
        'https://cryptospro.com.br/planetas/planeta_0000_tatooine.png',
        'https://cryptospro.com.br/planetas/planeta_0001_naboo.png',
        'https://cryptospro.com.br/planetas/planeta_0002_mustafar.png',
        'https://cryptospro.com.br/planetas/planeta_0003_kashyyyk.png',
        'https://cryptospro.com.br/planetas/planeta_0004_hoth.png',
        'https://cryptospro.com.br/planetas/planeta_0005_endor.png',
        'https://cryptospro.com.br/planetas/planeta_0006_dagobah.png',
        'https://cryptospro.com.br/planetas/planeta_0007_coruscant.png',
        'https://cryptospro.com.br/planetas/planeta_0008_bespin.png',
        'https://cryptospro.com.br/planetas/planeta_0009_alderaan.png',
    ];

    return (
        <div className={style.PlanetPage}>
            <div className={style['main-content']}>
                <div className={style['planet-header-inf-content']}>
                    <div className={style['planet-image-content']}>
                        <img src={urlsPlanets[indexImage]} alt="Planet" />
                    </div>
                    <div className={style['planet-name-and-global-inf-content']}>
                        <div
                            className={style['planet-name-content']}
                            onClick={handleEditClick}
                            tabIndex="0"
                        >
                            <dt>Planet:</dt>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={planetName}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    onKeyPress={handleInputKeyPress}
                                    ref={inputRef}
                                />
                            ) : (
                                <p>{planetName}</p>
                            )}
                        </div>
                        <div className={style['global-inf-content']}>
                            <div className={style['climate-content']}>
                                <div className={style['svg-climate-content']}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M12 10.1458V2.99999C12 1.34314 10.6568 0 9 0C7.34316 0 6.00001 1.34314 6.00001 2.99999V10.1458C5.07938 10.9698 4.5 12.1673 4.5 13.5C4.5 15.9853 6.51473 18 9 18C11.4853 18 13.5 15.9853 13.5 13.5C13.5 12.1673 12.9206 10.9698 12 10.1458ZM9 16.5C7.34316 16.5 6.00001 15.1568 6.00001 13.5C6.00001 12.6339 6.36708 11.8304 7.00038 11.2635L7.50002 10.8163V2.99999C7.50002 2.17157 8.17161 1.49998 9.00004 1.49998C9.82846 1.49998 10.5 2.17153 10.5 2.99999V10.8163L10.9997 11.2635C11.633 11.8304 12.0001 12.6338 12.0001 13.5C12 15.1568 10.6568 16.5 9 16.5Z" fill="black" />
                                        <path d="M9.75001 6H8.25V15H9.75001V6Z" fill="black" />
                                        <path d="M9 15.75C10.2426 15.75 11.25 14.7426 11.25 13.5C11.25 12.2574 10.2426 11.25 9 11.25C7.75736 11.25 6.75 12.2574 6.75 13.5C6.75 14.7426 7.75736 15.75 9 15.75Z" fill="black" />
                                    </svg>
                                </div>
                                <dt>Climate:</dt>
                                <p>{planet && planet.climate ? planet.climate.charAt(0).toUpperCase() + planet.climate.slice(1) : ""}</p>
                            </div>
                            <div className={style['terrain-content']}>
                                <div className={style['svg-terrain-content']}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
                                        <path d="M8.54094 0.263923C8.46229 0.106268 8.30323 0.00489397 8.12705 0C7.95332 0.00402003 7.79304 0.0942082 7.69918 0.240502L0.062903 13.6042C-0.0215173 13.7521 -0.020993 13.9337 0.0646508 14.0809C0.15012 14.2281 0.307425 14.3184 0.477664 14.3182H14.7959C14.9614 14.3184 15.1152 14.2329 15.2021 14.0921C15.2891 13.9514 15.297 13.7755 15.2229 13.6277L8.54094 0.263923Z" fill="black" />
                                        <path d="M20.9418 13.6126L15.2145 3.11272C15.1365 2.96904 14.9904 2.87536 14.8273 2.8647C14.6643 2.85386 14.5071 2.92744 14.4108 3.05941L12.3893 5.82588L16.6355 14.3182H20.5232C20.6915 14.3181 20.8474 14.2293 20.9332 14.0846C21.019 13.9398 21.0223 13.7605 20.9418 13.6126Z" fill="black" />
                                    </svg>

                                </div>

                                <dt>Terrain:</dt>
                                <p>{planet && planet.terrain ? planet.terrain.charAt(0).toUpperCase() + planet.terrain.slice(1) : ""}</p>
                            </div>
                            <div className={style['population-content']}>
                                <div className={style['svg-population-content']}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.45 11.4479C11.9473 11.1733 11.3707 11.0174 10.7578 11.0174H9.3012C8.67112 11.0174 8.07971 11.1822 7.5676 11.4709C6.49065 12.0772 5.76331 13.2315 5.76331 14.5553V15.6467H14.2957V14.5553C14.2957 13.2143 13.5496 12.0479 12.45 11.4479Z" fill="black" />
                                        <path d="M16.4726 10.0479H15.2616C14.5546 10.0479 13.8956 10.2568 13.3429 10.617C13.6085 10.7912 13.8581 10.9947 14.0882 11.2248C14.9777 12.1143 15.4675 13.2971 15.4675 14.5553V15.0686H19.9999V13.5752C19.9999 11.6303 18.4175 10.0479 16.4726 10.0479Z" fill="black" />
                                        <path d="M4.73828 10.0479H3.52734C1.58242 10.0479 0 11.6303 0 13.5752V15.0686H4.59141V14.5553C4.59141 13.2971 5.08164 12.1143 5.97109 11.2248C6.19258 11.0033 6.43203 10.8064 6.68672 10.6365C6.12812 10.2646 5.4582 10.0479 4.73828 10.0479Z" fill="black" />
                                        <path d="M15.8654 4.7428C15.8592 4.7428 15.8527 4.74284 15.8465 4.74291C14.5356 4.75374 13.4784 5.88674 13.4898 7.2685C13.5012 8.6437 14.5666 9.75491 15.869 9.75491C15.8752 9.75491 15.8816 9.75487 15.8879 9.75479C16.5307 9.74948 17.1305 9.4787 17.5769 8.99225C18.0129 8.51709 18.25 7.891 18.2446 7.2292C18.2332 5.85401 17.1678 4.7428 15.8654 4.7428Z" fill="black" />
                                        <path d="M4.13101 4.7428C4.1248 4.7428 4.11835 4.74284 4.1121 4.74291C2.80124 4.75374 1.74406 5.88674 1.75546 7.2685C1.76679 8.6437 2.83222 9.75491 4.1346 9.75491C4.14085 9.75491 4.14726 9.75487 4.15351 9.75479C4.79624 9.74948 5.39609 9.4787 5.84249 8.99225C6.27855 8.51709 6.51566 7.891 6.51019 7.2292C6.49882 5.85401 5.43343 4.7428 4.13101 4.7428Z" fill="black" />
                                        <path d="M10.0297 4.3533C8.51836 4.3533 7.28906 5.65213 7.28906 7.24901C7.28906 8.40291 7.93125 9.40135 8.8582 9.86619C9.21367 10.0447 9.61094 10.1443 10.0297 10.1443C10.4484 10.1443 10.8457 10.0447 11.2012 9.86619C12.1281 9.40135 12.7703 8.40291 12.7703 7.24901C12.7703 5.65213 11.541 4.3533 10.0297 4.3533Z" fill="black" />
                                    </svg>
                                </div>
                                <dt>Population:</dt>
                                <div className={style['population-number-content']}>
                                    <p>{planet && planet.population ? planet.population === 'unknown' ? '0' : addSpacesToEveryThreeCharacters(planet.population) : ""}</p>
                                </div>
                            </div>

                        </div>

                    </div>


                </div>

                <div className={style['residents-content']}>
                    <div className={style['title-residents-content']}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.52013 7.16208C9.49788 7.16208 11.1012 5.5588 11.1012 3.58104C11.1012 1.60329 9.49788 0 7.52013 0C5.54237 0 3.93909 1.60329 3.93909 3.58104C3.93909 5.5588 5.54237 7.16208 7.52013 7.16208Z" fill="black" />
                            <path d="M8.2794 7.8783H6.76104C5.87035 7.88111 4.98894 8.05934 4.16712 8.4028C3.34531 8.74625 2.5992 9.24822 1.97138 9.88003C1.34356 10.5118 0.846333 11.2611 0.508089 12.0851C0.169845 12.9091 -0.00279194 13.7916 3.41438e-05 14.6823C3.41438e-05 14.7773 0.0377629 14.8683 0.10492 14.9355C0.172078 15.0027 0.263163 15.0404 0.358138 15.0404H14.6823C14.7817 15.0313 14.874 14.9849 14.9404 14.9104C15.0069 14.836 15.0426 14.7391 15.0404 14.6393C15.0366 12.8473 14.3231 11.1298 13.056 9.86273C11.7889 8.59561 10.0714 7.88208 8.2794 7.8783Z" fill="black" />
                        </svg>
                        <dt>Residents:</dt>
                    </div>
                    <div className={style['separator-planet-page']}></div>
                    <div className={style['description-residents-container']}>
                        <div className={style['description-residents-content']}>
                            <p>{formattedResidentList && formattedResidentList ? formattedResidentList : noResident ? "No residents." : ""}</p>
                        </div>
                    </div>
                </div>

                <div className={style['films-content']}>
                    <div className={style['title-films-content']}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.885557 7.24285L4.57227 6.11571C3.61276 5.35334 2.65319 4.59091 1.69364 3.82851L0 4.34631L0.885557 7.24285ZM0.885557 7.24285H15.6815V15.7215C15.6815 16.3302 15.1834 16.8283 14.5746 16.8283H1.99245C1.38367 16.8283 0.885557 16.3302 0.885557 15.7215V7.24285ZM10.0098 12.0356L8.28351 11.0389L6.55726 10.0423V12.0356V14.0289L8.28351 13.0322L10.0098 12.0356ZM5.87203 5.71831C4.91249 4.9559 3.95291 4.1935 2.9934 3.4311L5.73711 2.59228C6.69662 3.35468 7.65622 4.11705 8.6157 4.87949L5.87203 5.71831ZM9.91549 4.48212L12.6592 3.6433L12.5761 3.5773L9.7806 1.35606L7.0369 2.19491C7.99641 2.95731 8.95595 3.71971 9.91549 4.48212ZM13.959 3.24589C12.9994 2.48349 12.0399 1.72109 11.0804 0.958688L14.2161 0L15.1017 2.89654L13.959 3.24589Z" fill="black" />
                        </svg>
                        <dt>Films ({filmList.length}):</dt>
                    </div>
                    <div className={style['separator-planet-page']}></div>
                    <div className={style['description-films-container']}>
                        <div className={style['description-films-content']}>
                            <p>{formattedFilmList && formattedFilmList.length ? formattedFilmList : nofilms ? "No Films." : ""}</p>
                        </div>
                    </div>


                </div>

            </div>
            <div className={style['go-back-container']} onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                    <path d="M6.90814 1.13766e-05C7.0091 -0.000454008 7.10918 0.0149574 7.20264 0.0453624C7.2961 0.0757675 7.38111 0.120567 7.45278 0.177194C7.52468 0.233991 7.58175 0.301564 7.62069 0.376018C7.65964 0.45047 7.67969 0.530327 7.67969 0.610983C7.67969 0.691638 7.65964 0.771496 7.62069 0.845948C7.58175 0.920401 7.52468 0.987974 7.45278 1.04477L1.85297 5.49875L7.45278 9.95274C7.59723 10.0678 7.67838 10.2238 7.67838 10.3865C7.67838 10.4671 7.65846 10.5469 7.61975 10.6213C7.58104 10.6957 7.5243 10.7634 7.45278 10.8203C7.38126 10.8773 7.29635 10.9225 7.2029 10.9533C7.10945 10.9841 7.00929 11 6.90814 11C6.70386 11 6.50795 10.9354 6.3635 10.8203L0.226727 5.93254C0.154829 5.87575 0.0977599 5.80817 0.0588152 5.73372C0.0198705 5.65927 -0.000179553 5.57941 -0.000179543 5.49875C-0.000179532 5.4181 0.0198705 5.33824 0.0588153 5.26379C0.09776 5.18934 0.154829 5.12176 0.226727 5.06497L6.3635 0.177194C6.43518 0.120567 6.52019 0.0757674 6.61365 0.0453624C6.70711 0.0149573 6.80719 -0.000454025 6.90814 1.13766e-05Z" fill="white" />
                </svg>
                <p>Voltar</p>
            </div>
        </div>
    );
}

export default PlanetPage;