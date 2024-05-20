import { readClient as client, writeClient } from "./Client";
import { fetchAllGenres } from "./genresServices";

//Funskjon for å legge til filmer som viser på nettside fra api til Sanity
export async function pushMovie(movie) {
    //Fetcher allGenres for å sammenligne dem med det som står i filmens data
    const allGenres = await fetchAllGenres()
    //console.log(movie.genres)
    //api returnerte sjangere bruker genres 2 ganger, så måtte bruke moviee.genres.genres for å få takk i dem
    //Bruker map gjennom de for å finne sjanger navn som er lagret i api som "text" field
    const movieGenres = movie.genres.genres?.map(
        item => item.text
    )

    //Da velger vi sjangere som tillpasser disse lagret i Sanity
    const chosenGenres = allGenres.filter(genre => movieGenres.includes(genre.name)) //Example of include in a filter: https://www.tutorialspoint.com/filter-array-with-filter-and-includes-in-javascript

    //console.log(chosenGenres)

    //Lager ny film i schemaType "film", gir den dataen fra api, og mapper chosenGenres (sjangere en film har, men funnet i Sanity databasen) for å få dem inni Sanity under lagret film
    //De trengte begge _key og _ref fordi Sanity viste feil om de mangler
    const newMovie = {
        _type: 'film',
        _id: movie.id,
        name: movie.originalTitleText.text,
        coverURL: movie.primaryImage.url,
        IMDBURL: `https://www.imdb.com/title/${movie.id}/`,
        genres: chosenGenres.map(genre => ({ _type: 'reference', _key: genre._rev, _ref: genre._id}))
    }

    //console.log(newMovie)

    //Bruker createIfNotExists for å slippe å få den samme filmen lagret flere ganger i Sanity
    const data = await writeClient.createIfNotExists(newMovie) //Kilde: https://www.sanity.io/docs/js-client#client_create_-is-removed-replace-with-one-of-clientcreate-clientcreateifnotexists-or-clientcreateorreplace
    
    return data
}

//Funksjon for å gi brukeren ny favoritt film
export async function appendFavMovieUser(movie, user_id) {

    const data = await pushMovie(movie)
    console.log(data)
    //setIfMissing er inspirert fra chat gpt svar på prompt sitert ned, det hjalp ved å løse feil at brukere klarte ikke å få ny filmer om de ikke hadde 1 film lagret i array fra før
    //Dokument sendt ved innlevering har skjermbilde av chat gpt svar
    await writeClient.patch(user_id) //chat gpt: "how to insert into an array of reference in sanity"
    .setIfMissing({favMovies: []}) 
    .append('favMovies', [{ _type: 'reference', _key: data._id, _ref: data._id }])
    .commit({autoGenerateArrayKeys: true})
    .then(() => {return "Film lagret som favoritt!"})
    .catch((error) => {return "Error: " + error.message})
}

//Funksjon for å gi brukeren ny ønskeliste film
export async function appendWishMovieUser(movie, user_id) {

    const data = await pushMovie(movie)
    //setIfMissing er inspirert fra chat gpt svar på prompt sitert ned, det hjalp ved å løse feil at brukere klarte ikke å få ny filmer om de ikke hadde 1 film lagret i array fra før
    //Dokument sendt ved innlevering har skjermbilde av chat gpt svar
    await writeClient.patch(user_id) //chat gpt: "how to insert into an array of reference in sanity"
    .setIfMissing({wishedMovies: []})
    .append('wishedMovies', [{ _type: 'reference', _key: data._id, _ref: data._id }])
    .commit({autoGenerateArrayKeys: true})
    .then(() => {return "Film lagret som ønsket!"})
    .catch((error) => {return "Error: " + error.message})
}

//Funksjon for å vise alle filmer lagret i Sanity som tilhører en sjanger
export async function fetchAllMoviesByGenre(slug) { //Inspirasjon for å bruke genres_ref i Sanity filter greie: https://www.sanity.io/answers/filtering-by-array-references-in-sanity-io
    const movies = await client.fetch(`*[_type == "film" && $slug in genres[]._ref]{ 
        _id,
        name,
        coverURL,
        IMDBURL,
        genres[] -> {_id, name}
    }`, {slug}) 
    
    return movies 
}