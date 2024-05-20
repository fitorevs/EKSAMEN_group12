/* Linje 2 til 7: Imports. */
import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { FaRunning, FaCompass, FaCouch } from "react-icons/fa";
import { fetchUserSaved } from "../../sanity/services/userServices"
import { authenticate } from "./AuthenticateUser"
import MovieCard from "./MovieCard"


export default function Dashboard() {
    authenticate()
    const { slug } = useParams()
    const [data, setData] = useState()

    const fetchData = async (paramObject) => {
        fetchUserSaved(paramObject).then((result) => {console.log("parseData", result)
            setData(parseData(result))
        })
    }

    useEffect(() => {
        const identificator = localStorage.getItem("identificator")
        fetchData(
            {thisUserID: identificator,
            otherUserID: slug}
        )
    }, [])

    const parseData = (toParse) => {

        let sharedWishlist = []
        let sharedFavorites = []
        let mixAndMatch = []
        let sharedGenres = []

        const findMatches = (arrayToMap, arrayToCompare) => {
            const arrayWithMatches = []
            arrayToMap?.map((thisItem) => {
                if (arrayToCompare?.find(match => match.name === thisItem.name)) {
                    //klarer ikke a fa det penere, beklager
                    const whoF = toParse.thisUser.favMovies?.map(movie => movie._id).includes(thisItem._id) ? toParse.thisUser.username : toParse.otherUser.username
                    const whoW = toParse.thisUser.wishedMovies?.map(movie => movie._id).includes(thisItem._id) ? toParse.thisUser.username : toParse.otherUser.username
                    arrayWithMatches.push({_id: thisItem._id, name: thisItem.name, coverURL: thisItem.coverURL, IMDBURL: thisItem.IMDBURL, favedBy: whoF, wishedBy: whoW})
                }
            })
            return arrayWithMatches
        }

        sharedWishlist = findMatches(toParse.thisUser.wishedMovies, toParse.otherUser.wishedMovies)
        sharedFavorites = findMatches(toParse.thisUser.favMovies, toParse.otherUser.favMovies)
        sharedGenres = findMatches(toParse.thisUser.favGenres, toParse.otherUser.favGenres)

        mixAndMatch = findMatches(toParse.thisUser.favMovies, toParse.otherUser.wishedMovies)
        .concat(findMatches(toParse.thisUser.wishedMovies, toParse.otherUser.favMovies))

        console.log({sharedFavorites, sharedWishlist, sharedGenres})
        return ({
            "sharedWishlist": sharedWishlist,
            "countWL" : sharedWishlist.length,
            "sharedFavorites": sharedFavorites,
            "countFL" : sharedFavorites.length,
            "thisUserName": toParse.thisUser.username,
            "otherUserName": toParse.otherUser.username,
            "sharedGenres": sharedGenres,
            "mixAndMatch": mixAndMatch
        })

    }

    return (
        <>
            <section id="dashboard">
                <h2 className="title">Forslag for {data?.thisUserName} og {data?.otherUserName}</h2>
                <section>
                    <span><FaRunning /> <p>Catch up!</p></span>
                    <p className="info">Dere har {data?.countWL} {data?.countWL === 1 ? "film" : "filmer"} felles i ønskelistene deres. </p>
                    {data?.sharedWishlist?.map((thisMovie, index) =>
                     <MovieCard key = {`sf${index}`}
                     name={thisMovie.name}
                     coverURL={thisMovie.coverURL}
                     IMDBURL={thisMovie.IMDBURL} 
                 />
                )}
                </section>
                <section>
                    <span><FaCouch /> <p>Go safe!</p></span>
                    <p className="info">Dere har {data?.countFL} {data?.countFL === 1 ? "film" : "filmer"} felles i favorittlisten deres. </p>
                    {data?.sharedWishlist?.map((thisMovie, index) =>
                     <MovieCard key = {`gs${index}`}
                     name={thisMovie.name}
                     coverURL={thisMovie.coverURL}
                     IMDBURL={thisMovie.IMDBURL} 
                 />
                )}
                </section>
                <section>
                    <span><FaCompass /> <p>Utforsk!</p></span>
                    <p className="info">Dere liker begge disse sjangerne, sjekk hvilke filmer som finnes å velge mellom:</p>
                    <ul>
                    {data?.sharedGenres?.map((thisGenre, index) =>
                    <Link key = {`e${index}`} to={`/genres/${thisGenre._id}`}><li><p>{thisGenre.name}</p></li></Link>
                )}
                    </ul>
                </section>
            </section>
            <section id="extension">
                <h2 className="title">Ønskelister Og Favoritter</h2>
                <p className="info">Dere har noen filmer som er på ønskelisten til en av dere og favorittlisten til den andre! Kanskje kan en av dere få innføre den andre i en ny filmopplevelse...?!</p>
                <section>
                {data?.mixAndMatch?.map((thisMovie, index) =>
                        <MovieCard 
                        name={thisMovie.name}
                        coverURL={thisMovie.coverURL}
                        IMDBURL={thisMovie.IMDBURL} 
                        key = {`mam${index}`} />
                    /*<p>Favoritt til: {thisMovie.favedBy}</p>
                    <p>I ønskeliste til: {thisMovie.wishedBy}</p>*/
                )}
                </section>
            </section>
        </>
    )
}