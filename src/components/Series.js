import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Series = () => {
  const { id } = useParams(); 
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [embedUrl, setEmbedUrl] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=78c4299eac6b3198abfc7465b7e05390`
        );
        const data = await response.json();
        setSeasons(data.seasons); 
        setSelectedSeason(data.seasons[0]?.season_number || 1); 

        const fetchEpisodes = async (seasonNumber) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=78c4299eac6b3198abfc7465b7e05390`
            );
            const data = await response.json();
            setEpisodes(data.episodes); 
            setSelectedEpisode(data.episodes[0]?.episode_number || 1); 
            setLoading(false); 
          } catch (error) {
            console.error('Error fetching episodes:', error);
            setLoading(false);
          }
        };

        fetchEpisodes(data.seasons[0]?.season_number); 
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      }
    };

    fetchSeasons();
  }, [id]);

  useEffect(() => {
    const updatedEmbedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
    setEmbedUrl(updatedEmbedUrl); 
  }, [id, selectedSeason, selectedEpisode]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>Watch TV Show</h1>
      
      <label htmlFor="seasons">Select Season:</label>
      <select
        id="seasons"
        value={selectedSeason}
        onChange={(e) => {
          setSelectedSeason(Number(e.target.value));
          const fetchEpisodes = async (seasonNumber) => {
            try {
              const response = await fetch(
                `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=78c4299eac6b3198abfc7465b7e05390`
              );
              const data = await response.json();
              setEpisodes(data.episodes); 
              setSelectedEpisode(data.episodes[0]?.episode_number || 1); 
            } catch (error) {
              console.error('Error fetching episodes:', error);
            }
          };
          fetchEpisodes(Number(e.target.value)); 
        }}
      >
        {seasons.map((season) => (
          <option key={season.season_number} value={season.season_number}>
            Season {season.season_number}
          </option>
        ))}
      </select>

      <label htmlFor="episodes">Select Episode:</label>
      <select
        id="episodes"
        value={selectedEpisode}
        onChange={(e) => setSelectedEpisode(Number(e.target.value))}
      >
        {episodes.map((episode) => (
          <option key={episode.episode_number} value={episode.episode_number}>
            Episode {episode.episode_number}: {episode.name}
          </option>
        ))}
      </select>

      <div>
        <iframe
          title="TV Show Episode"
          src={embedUrl}
          width="1000"
          height="600"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Series;