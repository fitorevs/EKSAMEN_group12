/* Linje 2 til 3: Imports. */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* Linje 6 til 33: Viktig funksjon som undersøker om brukeren er logget in. Hvis brukeren ikke er det blir de sendt til siden login. goto er et parameter som lar oss avgjøre hvilken side brukeren sendes til om de er logget in. Som standard er dette siden de befinner seg på. */
export const authenticate = (goto = "") => {

    /* Linje 9 Lagre instans i en variable. Vi ønske å sende brukeren til forsiden hvis de klarer å logge inn.  */
    const navigate = useNavigate()

    /* Linje 12: Midlertidig variable for å "huske" om vi har funnet ut at brukeren har en gyldig verdi. */
    let hasIdentificator = false
    /* Linje 14 til 19: Undersøke om identificator er i localStorage, altså at brukeren er logget in. */
    if (localStorage.getItem("identificator") !== null) {
        /* Linje 16: Sett riktig verdi for identificator, true hvis innlogget. */
        hasIdentificator = !!hasIdentificator //value == true, no value == false

    }

    /* Linje 21 til 32: Funksjon for å håndtere selv navigasjonen. Wraped i useEffect for å bare kjøre når alt har lastet. */
    useEffect(() => {
        /* Linje 23 til 29: Hvis brukeren er logget in og har en gyldig verdi. */
        if (hasIdentificator === true) {
            /* Linje 25 til 27: Enten så sender vi brukeren til en side. Eller så forblir de på sin side. Siden ingenting hender her hvis goto er tom. */
            if(goto !== "") {
                navigate(`/${goto}`)
            }
        /* Linje 29 til 31: Hvis brukeren ikke er logget in, send dem til /login siden. */
        } else {
            navigate("/login")
        }
    })
}