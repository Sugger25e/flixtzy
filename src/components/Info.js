import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Info() {
    const { type, id } = useParams('id');
    const [info, setInfo] = useState({})

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}?api_key=78c4299eac6b3198abfc7465b7e05390`
                );
                const data = await response.json();
                setInfo(data); 
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [type, id])

    return (
        <div>
            <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
    )
}

export default Info;