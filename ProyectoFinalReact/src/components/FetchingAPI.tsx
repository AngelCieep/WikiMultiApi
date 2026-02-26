import {useEffect, useState} from 'react';
import type {ApiResponse, Movie} from "../common/Interfaces.ts";
import PeliculaCardAPI from "./PeliculaCard2.tsx";

export default function FetchingAPI() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const URL = 'http://localhost:3000/api/v1/movies'

    const fetchMovies = async () => {
        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error('Error al obtener las películas');
            const data: ApiResponse = await response.json();
            setMovies(data.status);
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    if (loading) return <p>Cargando películas...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div>
            <h2>Películas</h2>
            <div className="container-fluid">
                <div className="row">
                    {movies.map((movie) => (
                        <div className="col-md-4 d-flex justify-content-center mb-4" key={movie._id}>
                            <PeliculaCardAPI id={movie._id} title={movie.title} year={movie.year} image={movie.poster}
                                             director={movie.director}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};