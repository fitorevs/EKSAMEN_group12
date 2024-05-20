import { useEffect, useState } from "react"
import { authenticate } from "./AuthenticateUser"
import { FaStar, FaFaceGrinHearts } from "react-icons/fa6"
import { FaExternalLinkSquareAlt } from "react-icons/fa"
import { appendGenreUser, fetchAllGenres, fetchUserGenres, removeGenreUser } from "../../sanity/services/genresServices"
import { Link } from "react-router-dom"
import Modal from "./Widget";

export default function AllGenres() {
    authenticate()

    //Variabler for sjangere lagret av bruker og alle sjangere som finnes i Sanity
    const [userGenres, setUserGenres] = useState()
    const [allGenres, setAllGenres] = useState()

    //Funskjon for å fetche alle sjangere fra Sanity ved å kalle funksjon fra genresServices
    const getAllGenres = async () => {
        const data = await fetchAllGenres()
        setAllGenres(data)
        console.log("Genres data", data)
    }

    //Funksjon for å fetche alle sjangere bruker har lagret som favoritt i Sanity ved å kalle funksjon fra genresServices, bruker identificator som bruker id
    const getUserGenres = async () => {
        const identificator = localStorage.getItem("identificator")
        const data = await fetchUserGenres(identificator)
        setUserGenres(data)
        console.log("User genres", data)
    }

    //useEffect for å kjøre funksjoner inni den med en gang nettside laster opp
    useEffect(() => {
        getAllGenres()
        getUserGenres()
    }, [])

    //Funksjon for å la sjanger som favoritt for brukeren
    const addGenreHandle = async (genre_id) => {
        const identificator = localStorage.getItem("identificator")
        await appendGenreUser(genre_id, identificator)
        getUserGenres() //Refetch etter oppdatering for å vise aktuelle dataen
        modalToggle("Ny sjanger lagt til din bruker.", false)
    } 

    //Funskjon for å fjerne favoritt sjanger fra brukerens liste
    const removeGenreHandle = async (genre_id) => {
        const identificator = localStorage.getItem("identificator")
        const index = userGenres.favGenres.findIndex(find => find._id === genre_id) //Finner plass bestemt favoritt sjanger står på i brukerens liste https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        await removeGenreUser(index, identificator)
        getUserGenres() //Refetch etter oppdatering for å vise aktuelle dataen
        modalToggle("Ny sjanger fjernet fra din bruker.", false)
    }

    //Modals som setter opp pop-up beskjed da brukeren legger til/sletter sjangere fra favorittliste, beskjedder er gitte oppover i funksjoner
    const [modalDisplay, setModalDisplay] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    const modalToggle = (message = "", conceal = true) => {
        if(conceal || modalDisplay == false) {
            setModalDisplay(prevCheck => !prevCheck)
        }
        setModalMessage(message)
    }

    return (
        <section id="genres">
            <Modal display={modalDisplay} message={modalMessage} close={modalToggle} />
            <h2 className="title">Sjangere</h2>
            {allGenres?.map((thisGenre) =>
            <section key={thisGenre._id}>
                <Link to={`/genres/${thisGenre._id}`}><h2>{thisGenre.name}</h2></Link>
                {userGenres?.favGenres?.map(genre => genre.name).includes(`${thisGenre.name}`) ? 
                <button onClick={() => removeGenreHandle(thisGenre._id)}><FaStar />Slett fra favorittlisten</button>
                :
                <button onClick={() => addGenreHandle(thisGenre._id)}><FaFaceGrinHearts />Legg til i favorittlisten</button>}
            </section>
            )
            }
        </section>
    )
}