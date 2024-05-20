import { useEffect, useState } from "react"
import { authenticate } from "./AuthenticateUser"
import { FaStar, FaFaceGrinHearts, FaCirclePlus } from "react-icons/fa6"
import MovieCard from "./MovieCard"
import { appendFavMovieUser, appendWishMovieUser } from "../../sanity/services/moviesServices"
import Modal from "./Widget";

export default function AllMovies() {
    authenticate()

    //Basis query er top boxoffice filmer så den viser noen film forslag da siden lastes, den har base_info i urlen fordi uten det, så api fetcher ikke sjangere og andre tillegs info
    const [query, setQuery] = useState("?list=top_boxoffice_200&info=base_info")
    //findMovie lagres bruker innput data fra søkefelt
    const [findMovie, setFindMovie] = useState()
    const [apiDisplay, setApiDisplay] = useState([])

    //Api kode tok fra https://rapidapi.com/SAdrian/api/moviesdatabase, tilpasset vår behov
    //Env kodet api key og host
    const url = `https://moviesdatabase.p.rapidapi.com/titles${query}`; 
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
        }
    };

    //useEffect som gjør api fetch hver gang query forandres, også ved start av siden
    useEffect(() => {
        //apiCall kode tok mest fra https://rapidapi.com/SAdrian/api/moviesdatabase, tilpasset vår behov
        const apiCall = async() => {
            try {
                const response = await fetch(url, options);
                setApiDisplay(await response.json());
            } catch (error) {
                console.error(error);
            }
        }

        apiCall()
    }, [query])

    console.log(apiDisplay)

    //Setter findMovie det vi har i søkefelt
    const handleChange = (event) => {
        setFindMovie(event.target.value)
    }

    //Da brukeren er ferdig å skrive i søkefelt og vil søke på skrev ting, så trykker hen på "søk" knapp og handleSubmit kjører
    //Da setter vi query til det som står i søkefelt + url struktur fra api for å søke etter film (ikke serie) 
    //og med base_info for å hente sjangere også, de henter ikke ved bare vannlig urlen
    const handleSubmit = (event) => {
        event.preventDefault()
        setQuery(`/search/title/${findMovie}?exact=false&info=base_info&titleType=movie`)
    }

    //Funksjon som kaller movieServices for å legge til favoritt film, bruker identificator for å finne brukeren
    const addFavMovie = async(thisMovie) => {
        const identificator = localStorage.getItem("identificator")
        await appendFavMovieUser(thisMovie, identificator)
        modalToggle("Ny film lagt til bruker sin favorittliste.", false)
    }

    //Funksjon som kaller movieServices for å legge til ønskeliste film, bruker identificator for å finne brukeren
    const addWishMovie = async(thisMovie) => {
        const identificator = localStorage.getItem("identificator")
        await appendWishMovieUser(thisMovie, identificator)
        modalToggle("Ny film lagt til bruker sin ønskeliste.", false)
    }

    //Modal set up som gir en pop-up beskjed om ny film er lagt til i funksjoner oppover
    const [modalDisplay, setModalDisplay] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    const modalToggle = (message = "", conceal = true) => {
        if(conceal || modalDisplay == false) {
            setModalDisplay(prevCheck => !prevCheck)
        }
        setModalMessage(message)
    }

    return (
        <section id="searchpage">
            <div>
                <h2 className="title">Filmer</h2>
                <Modal display={modalDisplay} message={modalMessage} close={modalToggle} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="findMovie">Søk etter film:</label>
                    <input type="text" id="findMovie" placeholder="Trolljegeren..." onChange={handleChange}></input>
                    <input type="submit" id="search" value="Søk"></input>
                </form>
            </div>
            {apiDisplay?.results?.map((thisMovie) =>
                <section className="extendedBox" key = {thisMovie.id}>
                    <MovieCard 
                        name={thisMovie.originalTitleText?.text}
                        coverURL={thisMovie.primaryImage?.url}
                        IMDBURL={`https://www.imdb.com/title/${thisMovie?.id}/`}
                    />
                    <span>
                        <button onClick={() => addWishMovie(thisMovie)}><FaCirclePlus />Legg til i ønskeliste</button>
                        <button onClick={() => addFavMovie(thisMovie)}><FaFaceGrinHearts />Legg til i favorittliste</button> 
                    </span>
                </section>
            )}
        </section>
    )
}