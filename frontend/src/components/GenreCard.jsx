/* Linje 2 til 7: Imports. */
import { useParams } from "react-router-dom" 
import { useEffect, useState } from "react" 
import { fetchAllGenres } from "../../sanity/services/genresServices"
import { fetchAllMoviesByGenre } from "../../sanity/services/moviesServices" 
import MovieCard from "./MovieCard" 
import { authenticate } from "./AuthenticateUser" 

export default function GenreCard() {
    authenticate() // Autentiserer brukeren ved å kalle authenticate-funksjonen.

    const {slug} = useParams() // Henter sjanger-slug fra URL-parametere.
    const [genre, setGenre] = useState() // Oppretter en state-variabel "genre" for å lagre valgt sjanger.
    const [movies, setMovies] = useState() // Oppretter en state-variabel "movies" for å lagre filmer i valgt sjanger.

    const getAllGenres = async () => { // Definerer en asynkron funksjon for å hente alle sjangere.
        const data = await fetchAllGenres() // Henter alle sjangere fra API.
        setGenre(data.find(genre => genre._id === slug)) // Setter valgt sjanger basert på slug fra URL.
        console.log("Genres data", data) // Logger alle sjangere for debugging.
    }

    const getAllMovies = async (slug) => { // Definerer en asynkron funksjon for å hente alle filmer i en bestemt sjanger.
        const data = await fetchAllMoviesByGenre(slug) // Henter filmer basert på sjanger-slug.
        setMovies(data) // Oppdaterer state-variabelen "movies" med de hentede filmene.
        console.log(data) // Logger hentede filmer for debugging.
    }

    console.log("Chosen genre", genre) // Logger valgt sjanger for debugging.

    useEffect(() => { // Bruker useEffect for å utføre handlinger ved komponentens første rendering.
        getAllGenres() // Henter alle sjangere.
        getAllMovies(slug) // Henter filmer for den valgte sjangeren basert på slug.
    }, []) // Tom array som andre argument sikrer at useEffect kun kjører én gang etter første rendering.

    return (
        <section id="genrepage">
            <h2 className="title">{genre?.name}</h2> {/* Viser navnet på den valgte sjangeren hvis tilgjengelig. */}
            {movies?.length != 0 ? null : <p>Ingen filmer lagt til fra sjangeren.</p>} {/* Viser melding hvis det ikke er noen filmer i sjangeren. */}
            {movies?.map((thisMovie) => // Mapper over filmer og viser et MovieCard for hver film.
                <MovieCard key={thisMovie._id}
                    name={thisMovie.name}
                    coverURL={thisMovie.coverURL}
                    IMDBURL={thisMovie.IMDBURL} 
                />
            )}
        </section>
    )
}
