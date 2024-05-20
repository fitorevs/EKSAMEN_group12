/* Linje 2 til 7: Imports. */
import { useEffect, useState } from "react" 
import { Link } from "react-router-dom" 
import { FaHeart, FaStar, FaUserFriends } from "react-icons/fa" 
import { fetchUserData } from "../../sanity/services/userServices" 
import { authenticate } from "./AuthenticateUser" 
import MovieCard from "./MovieCard" 

export default function Frontpage() {
    authenticate() // Autentiserer brukeren ved å kalle authenticate-funksjonen.

    const [data, setData] = useState() // Oppretter en state-variabel "data" for å lagre brukerdata.
    
    /* Her henter vi all data om en bruker. */
    const fetchData = async (user_id) => { // Definerer en asynkron funksjon for å hente brukerdata.
        fetchUserData(user_id).then((result) => setData(result)) // Henter brukerdata og oppdaterer state-variabelen "data" med resultatet.
    }
    
    useEffect(() => { // Bruker useEffect for å utføre en handling ved komponentens første rendering.
        const identificator = localStorage.getItem("identificator") // Henter brukerens identifikator fra localStorage.
        fetchData(identificator) // Henter brukerdata basert på identifikatoren.
    }, []) // Tom array som andre argument sikrer at useEffect kun kjører én gang etter første rendering.
    
    console.log(data) // Logger brukerdata til konsollen for debugging.

    return(
        <section id="frontpage">
            <h2 className="title">Hei, {data?.username}</h2> {/* Viser brukerens brukernavn hvis data er tilgjengelig. */}
            <section>
                <span><FaStar /><p> Filmer jeg skal se!</p></span> {/* Tittel og ikon for "Filmer jeg skal se!" */}
                {data?.favMovies?.map((thisMovie, index) => // Mapper over favorittfilmer og viser et MovieCard for hver film.
                    <MovieCard key={`ff${index}`}
                        name={thisMovie.name}
                        coverURL={thisMovie.coverURL}
                        IMDBURL={thisMovie.IMDBURL} 
                    />
                )}
            </section>
            <section>
                <span><FaHeart /> <p>Disse filmene ligger i ønskelisten din!</p></span> {/* Tittel og ikon for "Ønskelistefilmer" */}
                {data?.wishedMovies?.map((thisMovie, index) => // Mapper over ønskelistefilmer og viser et MovieCard for hver film.
                    <MovieCard key={`fw${index}`}
                        name={thisMovie.name}
                        coverURL={thisMovie.coverURL}
                        IMDBURL={thisMovie.IMDBURL} 
                    />
                )}
            </section>
            <section>
                <span><FaUserFriends /> <p>Jeg skal se sammen med...</p></span> {/* Tittel og ikon for "Filmpartnere" */}
                <ul>
                    {data?.users?.map((thisUser, index) => // Mapper over brukere og viser en link for hver bruker.
                        <li key={`u${index}`}>
                            <Link to={`/dashboard/${thisUser._id}`}>
                                <p>{thisUser.username}</p>
                            </Link>
                        </li>
                    )}
                </ul>
            </section>
        </section>
    )
}
