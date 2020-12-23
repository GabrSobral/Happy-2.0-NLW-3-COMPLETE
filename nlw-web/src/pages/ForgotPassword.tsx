import React, { useEffect, useState } from 'react'
import '../styles/pages/ForgotPassword.css'
import { Link, useHistory } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'
import { CSSTransition } from 'react-transition-group'

import api from '../services/api'
import LogoLogin from '../components/LogoLogin'

interface user{
    id: number,
    username: string,
}


export default function ForgotPassword(){
    const [ username, setUsername ] = useState('')
    const [ warning, setWarning ] = useState('')
    const [ users, setUsers ] = useState<user[]>([])
    const [ popup, setPopup ] = useState(false)

    const history = useHistory()

    useEffect(()=>{
        api.get('/users').then(response =>{
            setUsers(response.data)
        })
    },[])

   function Popup(){
        return(
                <div className="SentEmailMessage">
                    <span>Email enviado com sucesso! Olhe na sua caixa principal ou na sua caixa de spam :P</span>
                    <button type='button' onClick={()=>{ history.push("/login") }}>Confirmar</button>
                </div>
        )
   }

   async function handleSignIn(){
        username.trim()
        const count = users.filter(user =>{
            return user.username === username; 
        })
        if(count.length === 0){
            setWarning("Nenhum Usuário encontrado com este e-mail.")
            return
        }
        try{
            await api.post("/forgot-password", {'username': username}).then(()=>{
                setPopup(true)
            })
            
        } 
        catch(err){
            console.log(err)
        }

    }

    return(
 
        <div  id='login-page'> 
                <CSSTransition
                in={popup}
                timeout={300}
                classNames="alert"
                unmountOnExit
                onExited={() => setPopup(true)}
                >
                    <Popup/>
                </CSSTransition>
            <LogoLogin/>

            <div className="form-page">
                <Link to='/login' className='goBack'>
                    <FiArrowLeft size={24} color='#15C3D6'/>
                </Link>
                <div className='form-page-main'>
                    <h2 className='titlePassword'>Esqueci a senha</h2>
                    <p className='paragraphPassword'>Sua redefinição de senha será enviada para o e-mail cadastrado.</p>
                    <form>
                        <span>E-mail</span>
                        <input 
                            type='username' 
                            placeholder='Digite seu e-mail...'
                            className='login-form'
                            value={username}
                            autoFocus
                            onChange={(
                                event => setUsername(event.target.value)
                                )}/>

                            <span id='warning'>{warning}</span>

                        {username && !popup ? (
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
