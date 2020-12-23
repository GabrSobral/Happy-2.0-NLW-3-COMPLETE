/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FiArrowRight } from 'react-icons/fi'

import { Link} from 'react-router-dom'

import '../styles/global.css'

import '../styles/pages/landing.css'

import logoImg from '../images/Logo.svg'

function Landing() {
  return (
    <div id='page-landing'>
      <div className="content-wrapper">

        <div className='logo-and-location'>
          <img src={logoImg} alt="Happy"/>

           <div className='location'>
            <strong>Santos</strong>
            <span>São Paulo</span>
          </div>
        </div>
        

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>
        
          <Link to='/login' className='restriction-access'>
            Acesso restrito
          </Link>

         
        

        <Link to="/app" className='enter-app'>
          <FiArrowRight size={26} color="rgba(0, 0, 0.6)" />
        </Link>
      </div>
    </div>
  );
}

export default Landing;