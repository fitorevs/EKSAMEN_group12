/* Linje 2 til 5: Div. imports. */
import { useState } from "react"
import { createUser } from "../../sanity/services/userServices";
import { FaUserEdit, FaEnvelope, FaKey  } from "react-icons/fa";
import Modal from "./Widget";

/* Linje ... til ...: Motparte til LoginUser. Funksjon som presenterer en form fra hvilket brukeren kan lage en ny bruker. */
export default function CreateUser() {

    /* Linje 11 til 15: State for å holde på brukeren sin data, slik at den ikke "forsvinner" imellom de "små" refreshene til React. */
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })

    /* Linje 18 til 23: Funksjon som blir kalt hver gang vi forandrer dataen i input feltene. Som vil si, skriver noe. Vi kan hente verdien fra feltet gjennom event. */
    const handleChange = (event) => {
        const inputName = event.target.name
        const inputValue = event.target.value
        /* Linje 22: Oppdater data state med nyeste data. ...data henter alt fra data fra denne variablen. Deretter oppdaterer vi det feltet som vi har skrevet noe i -- gjennom inputName og inputValue. */
        setUser((data) => ({...data, [inputName]: inputValue}))
    }

    /* Linje 21 til 37: Funksjon hvilket overskriver hva et HTML form gjør naturlig. Ved å sende inn event kan vi bruke metoden preventDefault for å forhindre at siden laster på nytt. */
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        /* Linje 30 til 40: Kall funksjonen createUser og send inn dataen lagret i staten user. Så -- .then -- tøm den lagrede dataen. Fulgt av å tøme formen og presentere en melding til brukeren. */
        await createUser(user)
            .then(() => {
                setUser({
                    username: "",
                    email: "",
                    password: ""
                })
                document.getElementById("newUserForm").reset()
                modalToggle("Din bruker har blitt laget.")
            })
        }
    
    /* Linje 43 til 44: To states med verdier brukt av modalen vår. modalDisplay forteller modalen om den er synlig eller ikke. Mens modalMessage er hva som skal stå når modalen er synlig. Bedskjeden til brukeren. */
    const [modalDisplay, setModalDisplay] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    /* Linje 47 til 50: Funksjon for å slå av og på modalen. Med !prevCheck can vi "skru" boolean verdien i modalDisplay staten fra false og true. Til slutt setter vi en verdi for meldingen. */
    const modalToggle = (message = "") => {
        setModalDisplay(prevCheck => !prevCheck)
        setModalMessage(message)
    }

    return (
    <article id="user">
        <h2>Opprett ny konto</h2>
        {/* Linje 56: Kall mot modal hvor dataen den behøver sendes som props. Merk at close er en referanse mot en funksjon. */}
        <Modal display={modalDisplay} message={modalMessage} close={modalToggle} />
        {/* Linje 58 til 77: React icons er wraped i en span for å kunne bruke Flex for å få dem til å være på same linjen siden disse ikonene er bilder. */}
        <form id="newUserForm" onSubmit={handleSubmit}>
            <span>
                <FaUserEdit />
                <label htmlFor="username">Brukernavn</label>
            </span>
            <input type="text" id="username" name="username" placeholder="kristine..." onChange={handleChange} required/>
            <span>
                <FaEnvelope />
                <label htmlFor="email">E-post</label>
            </span>
            <input type="email" id="email" name="email" placeholder="kristine@gmail.com" onChange={handleChange} required/>
            <span>
                <FaKey />
                <label htmlFor="email">Passord</label>
            </span>
            <input type="password" id="password" name="password" placeholder="*********" onChange={handleChange} required/>
            <span id="buttonContainer">
                <button type="submit">Opprett ny konto</button> 
            </span>
        </form>
    </article>
    )
}
