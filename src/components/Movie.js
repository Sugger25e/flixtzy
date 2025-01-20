import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import '../styles/Movie.css';
import { useDetectAdBlock } from "adblock-detect-react";
import adguardImg from "../public/images/adguard.png";

function Movie() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null); 
    const [loading, setLoading] = useState(true);
    const adBlockDetected = useDetectAdBlock();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=78c4299eac6b3198abfc7465b7e05390`
                );
                const data = await response.json();
                setMovie(data); 
                setLoading(false); 
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]); 

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="movie-container">
            {!adBlockDetected && (
                <div className="adb-suggest">
                    <span>Adblock not detected! I highly suggest you to use one of these browser/extension:</span>
                    <div className="adb-imgs"> 
                        <img src="https://logodownload.org/wp-content/uploads/2022/04/brave-logo.png" alt="Brave" />
                        <img src={adguardImg} alt="AdGuard" />
                    </div>
                </div>
                )}
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-desc">{movie.overview}</p>
            <p>Ratings: {movie.vote_average.toFixed(1)}/10</p> 

            <iframe 
                title={movie.title} 
                src={`https://vidsrc.xyz/embed/movie/${id}`} 
                width="100%"  
                height="600" 
                allowFullScreen
                className="movie-iframe"
            ></iframe>


        </div>
    );
}

export default Movie;
