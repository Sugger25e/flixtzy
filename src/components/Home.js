import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Home.css";
import img1 from '../public/images/topnum/1.png';
import img2 from '../public/images/topnum/2.png';
import img3 from '../public/images/topnum/3.png';
import img4 from '../public/images/topnum/4.png';
import img5 from '../public/images/topnum/5.png';
import img6 from '../public/images/topnum/6.png';
import img7 from '../public/images/topnum/7.png';
import img8 from '../public/images/topnum/8.png';
import img9 from '../public/images/topnum/9.png';
import img10 from '../public/images/topnum/10.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faArrowTrendUp, faBars, faPlay, faStar } from '@fortawesome/free-solid-svg-icons';

const localImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

function Home() {
    const [pmovie, setPMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trendingMovieId, setTrendingMovieId] = useState(null);
    const [topMovies, setTopMovies] = useState([]);
    const [topSeries, setTopSeries] = useState([]);
    const [currentMIndex, setCurrentMIndex] = useState(0);
    const [currentSIndex, setCurrentSIndex] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const [pmimg, setpmimg] = useState({});
    const [psimg, setpsimg] = useState({});
    const location = useLocation();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleSearch = async (query) => {
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=78c4299eac6b3198abfc7465b7e05390&query=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();
        const filteredResults = data.results.filter(result => result.media_type !== 'person');
        setSearchResults(filteredResults.slice(0, 10)); 
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    useEffect(() => {
        const fetchTrendingMovie = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/movie/day?api_key=78c4299eac6b3198abfc7465b7e05390`
                );
                const data = await response.json();
                setTrendingMovieId(data.results[0].id);
                setTopMovies(data.results.slice(1, 11));
            } catch (error) {
                console.error("Error fetching trending movie:", error);
                setLoading(false);
            }
        };

        const fetchTrendingSeries = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/tv/day?api_key=78c4299eac6b3198abfc7465b7e05390`
                );
                const data = await response.json();
                setTopSeries(data.results.slice(1, 11));
            } catch (error) {
                console.error("Error fetching trending movie:", error);
                setLoading(false);
            }
        };

        fetchTrendingMovie();
        fetchTrendingSeries();
    }, []);

    useEffect(() => {
        if (trendingMovieId) {
            const fetchMovieDetails = async () => {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/${trendingMovieId}?api_key=78c4299eac6b3198abfc7465b7e05390`
                    );
                    const data = await response.json();
                    setPMovie(data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                    setLoading(false);
                }
            };

            fetchMovieDetails();
        }
    }, [trendingMovieId]);

    useEffect(() => {
        const preloadImages = () => {
            const mimages = {};
            const simages = {};
            topMovies.forEach(movie => {
                const img = new Image();
                img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
                mimages[movie.id] = img;
            });

            topSeries.forEach(series => {
                const img = new Image();
                img.src = `https://image.tmdb.org/t/p/original${series.poster_path}`;
                simages[series.id] = img;
            });
            setpmimg(mimages);
            setpsimg(simages);
        };

        if (topMovies.length > 0 || topSeries.length > 0) {
            preloadImages();
        }
    }, [topMovies, topSeries]);

    const handleMPrev = () => {
        setCurrentMIndex((prevIndex) => (prevIndex - 1 + topMovies.length) % topMovies.length);
    };

    const handleMNext = () => {
        setCurrentMIndex((prevIndex) => (prevIndex + 1) % topMovies.length);
    };

    const handleSPrev = () => {
        setCurrentSIndex((prevIndex) => (prevIndex - 1 + topSeries.length) % topSeries.length);
    };

    const handleSNext = () => {
        setCurrentSIndex((prevIndex) => (prevIndex + 1) % topSeries.length);
    };


    const toggleHam = () => {
        setMenuVisible(!menuVisible);
    };

    const getVisibleMovies = () => {
        const visibleMovies = [];
        for (let i = 0; i < 10; i++) {
            const index = (currentMIndex + i) % topMovies.length; 
            visibleMovies.push({
                movie: topMovies[index],
                localImage: localImages[index % localImages.length]
            });
        }
        return visibleMovies;
    };

    const getVisibleSeries = () => {
        const visibleSeries = [];
        for (let i = 0; i < 10; i++) {
            const index = (currentSIndex + i) % topSeries.length; 
            visibleSeries.push({
                series: topSeries[index],
                localImage: localImages[index % localImages.length]
            });
        }
        return visibleSeries;
    };

    if (!pmovie || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
           <div className="top-banner">
            {searchResults.length > 0 && (
              <div className="search-results-bar">
                {searchResults.map((item) => (
                <a href={`/${item.media_type === 'movie' ? 'movie' : 'tv'}/${item.id}`} key={item.id}>
                  <div className="search-result-item">
                    <div className="search-result-poster">
                      <img
                        src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                        alt={item.title || item.name}
                        className="result-poster-img"
                      />
                    </div>
                    <div className="search-result-info">
                      <h3>{item.title || item.name}</h3>
                      <p>{item.overview}</p>
                    </div>
                  </div>
                  </a>
                ))}
              </div>
            )}

            <img
                className="banner-img"
                src={`https://image.tmdb.org/t/p/original${pmovie.backdrop_path}`}
                alt={pmovie.title || "Top Movie"}
            />
            <div className="banner-navbar">
                <div className="links">
                <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
                <Link to="/movies" className={location.pathname === "/movies" ? "active" : ""}>Movies</Link>
                <Link to="/series" className={location.pathname === "/series" ? "active" : ""}>Series</Link>
                </div>
                <div className="search-bar-container">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        className="search-bar"
                    />
                  </form>
                </div>
                <div className="hamburger" onClick={toggleHam}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </div>
            {menuVisible && (
                <div className="navbar-menu">
                    <ul>
                        <li><Link to='/movies'>Movies</Link></li>
                        <li><Link to='/series'>Series</Link></li>
                    </ul>
                </div>
            )}
            <div className="banner-info">
                <p>Duration: {formatRuntime(pmovie.runtime)}</p>
                <p><span className="ratings"><span style={{color: '#f7d515'}}><FontAwesomeIcon icon={faStar} /></span> {pmovie.vote_average.toFixed(1)} &#8226; #1 Trending Today</span></p>
                <h1 className="title">{pmovie.title}</h1>
                <p className="desc">{pmovie.overview}</p>
                <a href={`/movie/${pmovie.id}`} className="watch-button"><FontAwesomeIcon icon={faPlay} /> <span class='text'>WATCH</span></a>
            </div>
        </div>
        
            <h1 className="top-movies-title"><FontAwesomeIcon icon={faArrowTrendUp} /> Trending Movies</h1>
            <div className="carousel-container">
                <button className="arrow left-arrow" onClick={handleMPrev}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className="carousel-card-container">
                    {getVisibleMovies().map(({ movie, localImage }, i) => (
                        <div className="carousel-card" key={i}>
                            <Link to={`/movie/${movie.id}`}>
                                <div className="poster-container">
                                    <img
                                        alt={movie.title}
                                        className="carousel-card-img"
                                        src={pmimg[movie.id].src}
                                    />
                                    <img
                                        alt={movie.title}
                                        className={`carousel-card-imgnum ${i === 9 ? 'imgnum-10' : ''}`}
                                        src={localImage}
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button className="arrow right-arrow" onClick={handleMNext}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>

            <h1 className="top-movies-title"><FontAwesomeIcon icon={faArrowTrendUp} /> Trending TV Shows</h1>
            <div className="carousel-container">
                <button className="arrow left-arrow" onClick={handleSPrev}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className="carousel-card-container">
                    {getVisibleSeries().map(({ series, localImage }, i) => (
                        <div className="carousel-card" key={i}>
                            <Link to={`/tv/${series.id}`}>
                                <div className="poster-container">
                                    <img
                                        alt={series.title}
                                        className="carousel-card-img"
                                        src={psimg[series.id].src}
                                    />
                                    <img
                                        alt={series.title}
                                        className={`carousel-card-imgnum ${i === 9 ? 'imgnum-10' : ''}`}
                                        src={localImage}
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button className="arrow right-arrow" onClick={handleSNext}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>

            
        </div>
    );
}

export default Home;