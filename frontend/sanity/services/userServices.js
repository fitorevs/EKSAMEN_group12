import { readClient as client, writeClient } from "./Client"

//Funsjon for å fetche bruker og navnene til andre brukere som eksisterer
export async function fetchUserData (user_id) {
    const data = await client.fetch(`*[_id == $user_id] {
        username,
        favMovies[]->{_id, name, coverURL, IMDBURL},
        wishedMovies[]->{_id, name, coverURL, IMDBURL},
        favGenres[]->{_id, name},
        "users": *[_type == "user" && _id != $user_id] {
            _id,
            username, 
        }
    }`, {user_id})
    
    return data[0]
}

//Funskjon for å lage ny bruker, brukte createIfNotExists, samme som ved filmer da det er kildert, 
//Har e-post som id fordi createIfNotExists tvinger for å ha id med, det sikrer at vi ikke kan lage ny brukere på samme e-post
//Har også tomme arrays for favMovies, wishedMovies og favGenres fordi klarte ikke å pushe data inni dem om de ikke eksisterte som arrays før
export async function createUser (user) {    
    const newUser = {
        _type: 'user',
        username: user.username,
        email: user.email,
        password: user.password,
        favMovies: [],
        wishedMovies: [],
        favGenres: []
    }

    await writeClient.create(newUser)
}

//Funksjon for å fetche logged inn bruker og andre bruker vi trykte på for å videre sammenligne deres filmer og sjangere, bruker slug som id
export async function fetchUserSaved (slug) {

    const thisUser = await client.fetch(
    `*[_type == "user" && _id == $slug.thisUserID] {
        username,
        favMovies[]->{_id, name, coverURL, IMDBURL},
        wishedMovies[]->{_id, name, coverURL, IMDBURL},
        favGenres[]->{_id, name}
      }` , {slug})
 
    const otherUser = await client.fetch(
        `*[_type == "user" && _id == $slug.otherUserID] {
            username,
            favMovies[]->{_id, name, coverURL, IMDBURL},
            wishedMovies[]->{_id, name, coverURL, IMDBURL},
            favGenres[]->{_id, name}
        }` , {slug})

    console.log("thisUser", thisUser)
    console.log("otherUser", otherUser)

    return {thisUser: thisUser[0], otherUser: otherUser[0]}
}

//Funksjon som henter ut brukernavn fra Sanity
export async function fetchUsername (slug) {
    const username = await client.fetch(`*[_type == "user" && _id == $slug].username`, {slug})
    return username
}