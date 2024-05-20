/* Linje 2 til 6: Standard import. Noe fra systemet, et par ikoner, og litt fra services for å jobbe mot Sanity. */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUserEdit, FaKey  } from "react-icons/fa";
import { readClient as client } from "./../../sanity/services/Client"
import Modal from "./Widget";

/* Linje 9 til 82: Dette er funksjonen som håndterer all logikk for å logge inn. Gjennom en intern form tar den imot data, og undersøker om brukeren finnes i systemet. Og lagrer deretter data i localStorage med brukeren sin Sanity ID. */
export default function LoginUser() {

    /* Linje 12: Lagre instans i en variable. Vi ønske å sende brukeren til forsiden hvis de klarer å logge inn.  */
    const navigate = useNavigate()

    /* Linje 15 til 18: State for å holde på brukeren sin data, slik at den ikke "forsvinner" imellom de "små" refreshene til React. */
    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    /* Linje 21 til 37: Funksjon hvilket overskriver hva et HTML form gjør naturlig. Ved å sende inn event kan vi bruke metoden preventDefault for å forhindre at siden laster på nytt. */
    const handleSubmit = async (event) => {
        event.preventDefault()
        /* Linje 24: Hent alle brukere fra Sanity sin Content Lake. Vi trenger dem for å sammenligne brukernavn og passordet brukeren har oppgitt. */
        const users = await client.fetch('*[_type == "user"]')
        /* Linje 26: Bruk metoden find mot arrayen users. Hvert element blir tilgjengelig/presentert i thisUser argumentet, så vi kan undersøke email og passord mot det. Hvis brukeren vår finnes blant alle brukerene blir userSearch sann (true). */
        const userSearch = users.find((thisUser) => thisUser.username == user.username && thisUser.password == user.password)
        /* Linje 28 til 34: Finnes brukeren ønsker vi å lagre deres Sanity ID i localStarge med navnet identificator. For å være ryddig fjerner vi all data fra formen, selv om det er litt overflødig. Deretter kan vi sende brukeren til frontpage. */
        if (userSearch !== undefined) {
            const identificator = userSearch._id
            localStorage.setItem("identificator", identificator)
            document.getElementById("loginUserForm").reset()
            navigate("/frontpage")
        /* Linje 34 til 36: Hvis enten eller både brukernavn og passord er feil presenterer vi brukeren med en generisk feilmelding. Men ellers bevarer form dataen så de kan redigere den. */
        } else {
            modalToggle("En feil oppstod, prøv igjen.")
        }
    }

    /* Linje 40 til 45: Funksjon som blir kalt hver gang vi forandrer dataen i input feltene. Som vil si, skriver noe. Vi kan hente verdien fra feltet gjennom event. */
    const handleChange = (event) => {
        const inputName = event.target.name
        const inputValue = event.target.value
        /* Linje 44: Oppdater data state med nyeste data. ...data henter alt fra data fra denne variablen. Deretter oppdaterer vi det feltet som vi har skrevet noe i -- gjennom inputName og inputValue. */
        setUser((data) => ({...data, [inputName]: inputValue}))
    }

    /* Linje 48 og 49: To states med verdier brukt av modalen vår. modalDisplay forteller modalen om den er synlig eller ikke. Mens modalMessage er hva som skal stå når modalen er synlig. Bedskjeden til brukeren. */
    const [modalDisplay, setModalDisplay] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    /* Linje 52 til 55: Funksjon for å slå av og på modalen. Med !prevCheck can vi "skru" boolean verdien i modalDisplay staten fra false og true. Til slutt setter vi en verdi for meldingen. */
    const modalToggle = (message = "") => {
        setModalDisplay(prevCheck => !prevCheck)
        setModalMessage(message)
    }

    /* Linje 58 til 81: Selve form for innloging. */
    return (
        {/* Linje 60 til 80: Article kort for å gjøre det enklere å style bare det vi ønsker på denne siden. */},
        <article id="user">
            <h2>Logg inn</h2>
            {/* Linje 63: Kall mot modal hvor dataen den behøver sendes som props. Merk at close er en referanse mot en funksjon. */}
            <Modal display={modalDisplay} message={modalMessage} close={modalToggle} />
            {/* Linje 65 til 79: React icons er wraped i en span for å kunne bruke Flex for å få dem til å være på same linjen siden disse ikonene er bilder. */}
            <form id="loginUserForm" onSubmit={handleSubmit}>
                <span>
                    <FaUserEdit/>
                    <label htmlFor="username">Brukernavn </label>
                </span>
                <input type="text" id="username" name="username" placeholder="kristine..." onChange={handleChange} required/>
                <span>
                    <FaKey />
                    <label htmlFor="password">Passord </label>
                </span>
                <input type="password" id="password" name="password" placeholder="*********" onChange={handleChange} required/>
                <span id="buttonContainer">
                    <button type="submit">Logg inn</button>
                </span>
            </form>
        </article>
    )
}