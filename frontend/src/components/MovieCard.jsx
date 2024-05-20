/* Linje 2: Import for å kunne sette opp lenker. */
import { Link } from "react-router-dom";

/* Linje 5 til 14: Sentrale komponentet som brukes for å presentere filmer. Tree props brukes, for å få med navnet til filmen, URL-en til bildet, og URL-en til filmen sin IMDB side. */
export default function MovieCard({name, coverURL, IMDBURL}) {
    return (
        <article className="card">
            {/* Linje 9 til 11: Wrap navnet til bildet i en A -- "link" -- tag som tar brukeren til IDMB siden. _blank brukes for target så du forblir på siden. */}
            <Link to={IMDBURL} target="_blank">
                <h2>{name}</h2>
            </Link>
            {/* Linje 13: Som nevnt i eksamensdokumentet. API-et kan gi lenker til bilder som ikke finnes. Vi fant ikke noe måte å forhindre GET feilmeldingen. Men kan benytte onError for å få med et "stand-in" bilde. Med onError kan vi kjøre en funksjon hvis bildet ikke laster. Vi får dermed lagt in et såkalt placeholder bilde istedetfor. */}
            <img onError={(IMG) => IMG.currentTarget.src="https://placehold.co/400x600"} src={coverURL}/>
        </article>
    )
}