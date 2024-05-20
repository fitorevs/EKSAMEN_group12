/* Linje 2 til 7: Imports. */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaStar, FaUserFriends } from "react-icons/fa"
import { authenticate } from "./AuthenticateUser"
import MovieCard from "./MovieCard"
import { fetchUserData } from "../../sanity/services/userServices"

export default function Frontpage() {
    authenticate()

    const [data, setData] = useState()
    
    /* Her henter vi all data om en bruker. */
    const fetchData = async (user_id) => {
        fetchUserData(user_id).then((result) => setData(result))
    }
    
    useEffect(() => {
        const identificator = localStorage.getItem("identificator")
        fetchData(identificator)
    }, [])
    
    console.log(data)

    return(
        <section id="frontpage">
            <h2 className="title">Hei, {data?.username}</h2>
            <section>
                <span><FaStar /><p> Filmer jeg skal se!</p></span>
                {data?.favMovies?.map((thisMovie, index) =>
                    <MovieCard key = {`ff${index}`}
                        name={thisMovie.name}
                        coverURL={thisMovie.coverURL}
                        IMDBURL={thisMovie.IMDBURL} 
                    />
                )}
            </section>
            <section>
                <span><FaHeart /> <p>Disse filmene ligger i ønskelisten din!</p></span>
                {data?.wishedMovies?.map((thisMovie, index) => //? so map doesn't error if no data yet, forever waiting for itXD
                    <MovieCard key = {`fw${index}`}
                    name={thisMovie.name}
                    coverURL={thisMovie.coverURL}
                    IMDBURL={thisMovie.IMDBURL} 
                />
                )}
            </section>
            <section>
                <span><FaUserFriends /> <p>Jeg skal se sammen med...</p></span>
                <ul>
                    {data?.users?.map((thisUser, index) =>
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