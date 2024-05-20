/* Linje 2 til 10: Forskjellige imports. Viktigst, selve Layout og alle de tilhørende sidene. */
import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './Layout'
import CreateUser from './CreateUser'
import LoginUser from './LoginUser'
import Frontpage from './Frontpage'
import Dashboard from './Dashboard'
import AllGenres from './AllGenres'
import AllMovies from './AllMovies'
import GenreCard from './GenreCard'

export default function BuildRoutes() {
    return (
        <Routes>
            {/* Linje 16: Wrap alt i layouten Layout gjennom en root path. */}
            <Route path="/" element={<Layout />}>
                {/* Linje 18 til 24: De forskjellige sidene. I tilfellet med dashboard og genres siden brukes en slug for å henvise til viktig data mellomlagret i URL-en. */}
                <Route path="/new" element={<CreateUser />} />
                <Route path="/login" element={<LoginUser />} />
                <Route path="/frontpage" element={<Frontpage />} />
                <Route path="/dashboard/:slug" element={<Dashboard />} />
                <Route path="/genres" element={<AllGenres />} />
                <Route path="/genres/:slug" element={<GenreCard />} />
                <Route path="/movies" element={<AllMovies />} />
                {/* Linje 26: Sett index, altså hvilken skal du kommer til som standard. På grunn av authenticate funksjonen blir du sendt til login hvis du ikke er logget inn. Som betyr at nye / ikke innloggete brukere blir sendt til login siden, og resten til frontpage. */}
                <Route index element={<Navigate to="/frontpage" />} />
            </Route>
        </Routes>
    )
}