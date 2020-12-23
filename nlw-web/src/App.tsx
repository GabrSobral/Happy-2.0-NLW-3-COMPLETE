import React from 'react'
import Routes from './routes'

import './styles/global.css'
import 'leaflet/dist/leaflet.css'

import { RoleProvider } from './pages/Login'


function App() {
  return (
    <RoleProvider>

      <Routes/>

    </RoleProvider>
  )
}

export default App;
