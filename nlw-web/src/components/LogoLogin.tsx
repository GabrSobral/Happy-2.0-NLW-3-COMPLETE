import React from 'react'
import mapMarkerImg from '../images/map-marker.svg'

import '../styles/components/LogoLogin.css'

export default function LogoLogin(){
    return(
        <div className='main-logo'>
        <img src={mapMarkerImg} alt="Happy" />

        <h1 className='logo'>happy</h1>

        <div className='location'>
            <strong>Santos</strong>
            <span>São Paulo</span>
        </div>

        </div>
    )
}

