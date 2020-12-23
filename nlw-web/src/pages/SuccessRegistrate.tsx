import React from 'react'
import { Link
 } from 'react-router-dom'
import '../styles/pages/SuccessRegistrate.css'
import Ebaaa from '../images/Ebaaa.svg'
import { FiArrowLeft} from 'react-icons/fi'

export default function SuccesRegistrate(){
    return(
        <div id="Success-page">
            <div className="content-wrapper">
                <main>
                    <h1>Ebaaa!</h1>
                    <p>O cadastro deu certo e foi enviado
                        ao administrador para ser aprovado.
                        Agora é só esperar!</p>
                    <div className='buttons-yes-no'>
                        <Link to='/app' className='back-to-app'>
                           <FiArrowLeft size={24}color='#fff'/> Voltar para a pagina inicial
                        </Link>   
                    </div>
                </main>
                <img src={Ebaaa} alt="Happy" />
            </div>
        </div>
    )
}