import React, { useState, useEffect } from 'react'
import '../styles/pages/ForgotPassword.css'

import { Link, useHistory, useLocation } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'

import api from '../services/api'

import LogoLogin from '../components/LogoLogin'
    

export default function ForgotPassword(){
    const location = useLocation()

    const [ token, setToken] = useState('')
    const [ password, setPassword ] = useState('')
    const [ newPassword, setNewPassword] = useState('')
    const [ username, setUsername] = useState('')
    const [ warning, setWarning ] = useState('')

    const history = useHistory()

    useEffect(()=>{
        const url = location.search.split("?t=")
        setToken(url[1])
        setUsername(url[2])
    },[location.search])

   async function handleSignIn(){
        password.trim()
        newPassword.trim()

        if(password !== newPassword){
            setWarning('Confirmação de senha inválida.')
            return
        }
        try{
            await api.post("/reset-password", {'username': username,'token':token, 'password': password})       
            return history.push('/')
        } 
        catch(err){
            console.log(err)
        }

   }

    return(
        <div  id='login-page'>
            <LogoLogin/>

            <div className="form-page">
                <Link to='/login' className='goBack'>
                    <FiArrowLeft size={24} color='#15C3D6'/>
                </Link>
                <div className='form-page-main'>
                    <h2 className='titlePassword'>Redefinição de senha</h2>
                    <p className='paragraphPassword'>Escolha uma nova senha para você acessar o dashboard do Happy</p>
                    <form>
                        <span>Senha</span>
                        <input 
                            type='password' 
                            placeholder='Digite sua senha...'
                            className='login-form'
                            value={password}
                            autoFocus
                            onChange={(
                                event => setPassword(event.target.value)
                                )}/>

                        <span>Digite sua senha novamente</span>
                        <input 
                            type='password' 
                            placeholder='Confirme sua senha...'
                            className='login-form'
                            value={newPassword}
                            autoFocus
                            onChange={(
                                event => setNewPassword(event.target.value)
                                )}/>        

                            <span id='warning'>{warning}</span>

                        {password && newPassword ? (
                            <button type='button' onClick={handleSignIn}>Entrar</button>
                        ) : (
                            <div  className='disabled'>Entrar</div>
                        )}
                                           
                    </form>
                </div> 
                
            </div>
            
        </div>
    )
}
