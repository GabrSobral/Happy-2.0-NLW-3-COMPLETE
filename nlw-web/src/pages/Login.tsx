import React, {FormEvent, useState, createContext, useContext} from 'react'
import '../styles/pages/login.css'

import { Link, useHistory } from 'react-router-dom'

import { FiArrowLeft, FiKey, FiAtSign } from 'react-icons/fi'

import { login } from '../services/auth'
import api from '../services/api'

import LogoLogin from '../components/LogoLogin'

const RoleContext = createContext('' as any)

export function RoleProvider({ children } : any) { 
    const [ role, setRole ] = useState('')
    return(
        <RoleContext.Provider 
        value={{
            role,
            setRole
        }}>
            {children} 
        </RoleContext.Provider>
    )
}

export function useRole() {
    const context = useContext(RoleContext)
    const { role, setRole } = context
    
    return { role, setRole }
}


export default function Login(){
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ warning, setWarning ] = useState('')
    const [remember, setRemember] = useState(false)
    const { setRole } = useRole()

    const history = useHistory()

    

   async function handleSignIn(event : FormEvent ){
        event.preventDefault()


        try {
            username.trim()
            await api.post("/login", { username, password }).then((response)=>{
                setRole(response.data.user.role)
                
                login(response.data.token, remember);
                history.push('/dashboard/registrated')
            })
            
          } 
        catch (err) {
            setWarning("E-mail ou Senha Errados. Digite novamente")
            setUsername('')
            setPassword('')
            return 
        };

   }

    return(
        <div  id='login-page'>
             <LogoLogin/>

            <div className="form-page">
                <Link to='/' className='goBack'>
                    <FiArrowLeft size={24} color='#15C3D6'/>
                </Link>
                <div className='form-page-main'>
                    <h2>Fazer login</h2>
                    <form onSubmit={handleSignIn}>
                        <span>E-mail</span>
                        <div>
                            <FiAtSign size={20} color='gray'/>
                            <input 
                                type='username' 
                                placeholder='Digite seu e-mail...'
                                className='login-form'
                                value={username}
                                autoFocus
                                onChange={(
                                    event => setUsername(event.target.value)
                                    )}/>
                        </div>
                        

                        <span>Senha</span>
                        <div>
                            <FiKey size={20} color='gray'/>
                            <input 
                                type='password' 
                                placeholder='Digite sua senha...'
                                className='login-form'
                                value={password}
                                onChange={(
                                    event => setPassword(event.target.value)
                                    )}/>
                        </div>
                       

                        <div className='checkbox-forgotPassword'>
                                <label>
                                    <input
                                        name="rememberMe"
                                        type="checkbox"
                                        onChange={(event) => { setRemember(event.target.checked);}} />
                                        Lembrar-me
                                </label> 
                            
                            <Link to='/forgot-my-password' className='forgot-password'>Esqueci minha senha</Link>
                        </div>

                            <span id='warning'>{warning}</span>

                        {username && password ? (
                            <button type='submit'>Entrar</button>
                        ) : (
                            <div  className='disabled'>Entrar</div>
                        )}
                                           
                    </form>
                </div> 
            </div>
            
        </div>
    )
    
}
