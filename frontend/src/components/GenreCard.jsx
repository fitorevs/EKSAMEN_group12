/* Linje 2 til 7: Imports. */
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchAllGenres } from "../../sanity/services/genresServices"
import { fetchAllMoviesByGenre } from "../../sanity/services/moviesServices"
import MovieCard from "./MovieCard"
import { authenticate } from "./AuthenticateUser"


export default function GenreCard() {
    authenticate()

    const {slug} = useParams()
    const [genre, setGenre] = useState()
    const [movies, setMovies] = useState()

    const getAllGenres = async () => {
        const data = await fetchAllGenres()
        setGenre(data.find(genre => genre._id === slug))
        console.log("Genres data", data)
    }

    const getAllMovies = async (slug) => {
        const data = await fetchAllMoviesByGenre(slug)
        setMovies(data)
        console.log(data)
    }

    console.log("Chosen genre", genre)

    useEffect(() => {
        getAllGenres()
        getAllMovies(slug)
    }, [])

    return (
        <section id="genrepage">
            <h2 className="title">{genre?.name}</h2>
            {movies?.length != 0 ? null : <p>Ingen filmer lagt til fra sjangeren.</p>}
            {movies?.map((thisMovie) =>
                    <MovieCard key = {thisMovie._id}
                    name={thisMovie.name}
                    coverURL={thisMovie.coverURL}
                    IMDBURL={thisMovie.IMDBURL} 
                />
            )}
        </section>
    )
}