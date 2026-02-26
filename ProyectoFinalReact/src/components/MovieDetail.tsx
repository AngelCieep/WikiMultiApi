import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Imdb} from "../common/Interfaces.ts";

type Movie = {
    _id: string;
    title: string;
    year: number;
    poster: string;
    director: string;
    plot: string;
    genres: string[];
    imdb: Imdb;
};
export default function MovieDetail() {
    const URL = 'http://localhost:3000/api/v1/movies/movie/';    const {id} = useParams<{ id: string }>();

    const [movie, setMovie] = useState<Movie | null>(null)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const fetchMovie = async () => {
        fetch(URL + id)
            .then(async response => {
                if (!response.ok) throw new Error('Error al obtener la película')
                const body = await response.json();
                return body.status;
            })
            .then((movie: Movie) => setMovie(movie))
            .catch(err => setError(err.message || 'Error desconocido'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMovie();
    }, [id]);

    if (loading) {
        return <p>Cargando Película...</p>;
    }
    if (error) {
        return (<p className="text-danger">Error: {error}</p>);
    }

    if (!movie) {
        return <p>Cargando Pelicula...</p>
    }
    return (
        <div className="container-fluid p-3 mt-4">
            <div className="row border border-1 border-opacity-50 rounded p-2">
                <div className="col-5">
                    <img className="img-fluid rounded-2 w-50" src={movie.poster} alt={movie.title}/>
                </div>
                <div className="col-7 border-1 border-opacity-50 rounded p-2">
                    <h1 className="card-title my-2">{movie.title}</h1>
                    <p className="card-subtitle my-2">Director: {movie.director}</p>
                    <p className="text-success my-2">Año: {movie.year}</p>
                    <p className="card-text">Descripción: {movie.plot}</p>
                    {movie.genres.map(genre => (
                        <span key={genre} className="badge bg-success me-1">{genre}</span>
                    ))}
                    <div className=" d-flex flex-row justify-content-center align-items-center  mt-3">
                        <p className="text-info mx-2 my-2">Rating: {movie.imdb.rating} / 10</p>
                        <p className="text-success mx-2 my-2">Votes: {movie.imdb.votes}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
