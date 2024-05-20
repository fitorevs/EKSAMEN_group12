import { readClient as client, writeClient } from "./Client";

//Funksjon for å fetche alle sjangere vi har lagret i Sanity med filter for å få dem alfabetisk
export async function fetchAllGenres() {
    const genres = await client.fetch(`*[_type == "genre"] | order(name asc)`) //https://www.sanity.io/docs/query-cheat-sheet
    return genres
}

//Funksjon for å fetche sjangere bruker har lagret som favoritt, tar imot user_id og filtrerer basert på den for å finne innhold til favGenres array bruker har
export async function fetchUserGenres(user_id) {
    const data = await client.fetch(`*[_id == $user_id] {favGenres[]->{_id, name}
    }`, {user_id})

    return data[0]
}

//Funksjon for å pushe inn fav sjanger til bruker, _type reference for å hendvise til riktig eksisterende sjanger id, tar imot bruker og sjanger id
export async function appendGenreUser(genre_id, user_id) {
    console.log(genre_id, user_id)
    await writeClient.patch(user_id)
    .append('favGenres', [{ _type: 'reference', _ref: genre_id }])
    .commit({autoGenerateArrayKeys: true})
    .then(() => {return "Sjanger lagret som favoritt!"})
    .catch((error) => {return "Error: " + error.message})
}

//Funksjon for å fjerne sjanger fra brukerens favoritter, bruker unsett avhengig av index i brukerens favGenres array av sjanger som vi finner ved å bruke find() i AllGenres komponent
export async function removeGenreUser (index, user_id) {
    //https://stackoverflow.com/questions/71670582/how-to-delete-a-document-attribute-in-sanity-io
    //https://www.sanity.io/docs/http-patches
    await writeClient.patch(user_id)
    .unset([`favGenres[${index}]`])
    .commit()
    .then(() => {return "Sjanger er slettet fra favoritt!"})
    .catch((error) => {return "Error: " + error.message})
}
