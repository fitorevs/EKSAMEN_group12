/* Linje 2 til 7: Imports. */
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTv, FaRegUserCircle, FaDoorOpen } from "react-icons/fa"
import { fetchUsername } from "./../../sanity/services/userServices"
/* Ikon fra: https://game-icons.net/1x1/delapouite/3d-glasses.html */
import logo from './../assets/logo.png'

/* Linje 10 til 73: Funksjon som holder på hoved layouten til siden. Dette er den eneste layouten i bruk. Ved å benytte Outlet kan vi ha lik header og footer på alle sider. */
export default function Layout() {

    /* Linje 13: Lagre stien fra URL-en. Behøves siden login / new har egen header. */
    const location = useLocation()

    /* Linj 16 og 17: States som holder viktig data. */
    const [page, setPage] = useState(location.pathname)
    const [username, setUsername] = useState(location.pathname)

    useEffect(() => {
        /* Linje 21 til 25: Hent ID-en til brukeren. Og så stien til URL en. Deretter brukernavnet til den innlogete brukeren. Gjør dette innenfor useEffect så det kjører etter alt har lastet. */
        const identificator = localStorage.getItem("identificator")
        setPage(location.pathname)
        fetchUsername(identificator).then(result => {
            setUsername(result)
        })
    }, [location.pathname])

    /* Linje 30 til 32: Funksjon for å logge ut brukeren. Fjern alt fra localStorage. */
    const terminateSession = () => {
        localStorage.clear()
    }

    return (
        <>
            {/* Header-seksjonen */}
            <header>
                {/* Linje 38: Undersøk om vi er på new eller login siden. Disse har en egen header. */}
                {!["/new", "/login"].includes(page) ? 
                    <nav>
                        {/* Linje 41 til 48: Dette er header for de fleste sider. En del li elementer har ID fordi vi ønsker å bruke flex for å få ikoner til å være på linje med tekst. */}
                        <Link to="/frontpage" id="logo"><img src={logo} /> <h2 className="neonText">What to see?</h2></Link> {/* Logo med lenke til startsiden */}
                        <ul>
                            <li><Link id="frontpageLink" to="/frontpage"><FaTv /> <p>Hva skal jeg se?</p></Link></li>
                            <li><Link id="genreLink" to="/genres">Bla gjennom sjangere</Link></li>
                            <li><Link id="moviesLink" to="/movies">Bla gjennom filmer</Link></li>
                            {/* Linje 47: Navnet til brukeren og ikonet. Denne kan trykkes på for å logge ut. */}
                            <li onClick={terminateSession}><Link id="userpageLink" to="/"><FaRegUserCircle /> <p>{username}</p></Link></li>
                        </ul>
                    </nav>
                :
                    <nav>
                        {/* Linje 53 til 56: En type dobbel / dual knapp, for å navigere mellom new og login. */}
                        <ul id="dual">
                            <li><Link className={page !== "/new" ? "inactive" : "active"} to="/login"><FaDoorOpen /> <p>Logg inn</p></Link></li>
                            <li><Link className={page !== "/login" ? "inactive" : "active"} to="/new"><FaRegUserCircle /> <p>Opprett ny konto</p></Link></li>
                        </ul>
                    </nav>
                }
            </header>

            {/* Hovedseksjonen */}
            <main> 
                {/* Linje 64: Når React finner en Route den kjenner igjen blir dette element byttet ut med det inneholdet. Som vil si den siden . */}
                <Outlet />
            </main>

            {/* Footer-seksjonen */}
            <footer>
                <p> WhatToSee &copy; 2024</p> {/* Kilde: https://www.w3schools.com/html/html_symbols.asp */}
            </footer>
        </>
    );
}