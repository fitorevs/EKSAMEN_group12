/* Linje 2 til 4: Standard import. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
/* Linje 6: Laste inn normalize for å "nullstille" all CSS. */
import './normalize.css'
/* Linje 8: Hente in BrowserRouter fra react-router-dom for å sette opp global routing. */
import { BrowserRouter as Router } from 'react-router-dom'

/* Linje 11 til 15: Wrap kallet til App funksjonen i en routing instans. */
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)