/* Linje 2: Import av ikon fra React Icons. */
import { FaWindowClose } from "react-icons/fa";

/* Linje 5 til 15: Funksjon hvilket har jobben å vise en beskjed til brukeren, frem til den er lukket. Selve boolean verdien (display) for om den er åpen, og stringen for meldingen (message) er lagret som states i "parent" funksjonen. Med close prop-en kan vi sende inn en referanse for logikken som forandrer display til false. */
export default function Modal ({display, message, close}) {
    /* Linje 7 til 14: Hvis display er sann send tilbake HTML, om ikke hold dette skjult. */    
    return (
        display ?
        <div className="modal">
            <p>{message}</p> <FaWindowClose onClick = {() => {close()}} />
        </div>
        :
        null
    )
}