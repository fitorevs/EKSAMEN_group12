/* Dette er hoved funksjonen. Den blir kalt av main.jsx og er ansvarlig for å sette opp dynamisk routing. */

/* Linje 4: Hent BuildRoutes funksjonen fra components. */
import BuildRoutes from './components/BuildRoutes'
/* Linje 6: Last in den sentrale SASS filen. */
import './styles/Main.scss'

/* Linje 9 til 15: Standard oppsett. Kall BuildRoutes for å sette opp alt. */
function App() {  
  return (
    <BuildRoutes />
  )
}

export default App