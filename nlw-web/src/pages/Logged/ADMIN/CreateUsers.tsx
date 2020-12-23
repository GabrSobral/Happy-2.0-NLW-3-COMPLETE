import React, { useEffect, useState } from 'react'
import mapMarkerImg from '../../../images/map-marker.svg'
import { FiPower, FiMapPin, FiAlertCircle, FiArrowLeft, FiUserPlus, FiAtSign, FiUser} from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';

import '../../../styles/pages/CreateUsers.css'
import api from '../../../services/api';
import { logout } from '../../../services/auth';

import { CSSTransition } from 'react-transition-group';

interface user{
    id: number,
    username: string,
}

export default function Dashboard(){
    const history = useHistory()

    const [ email, setEmail ] = useState('')
    const [ name, setName ] = useState('')
    const [ permission, setPermission ] = useState('')
    const [ popup, setPopup ] = useState(false)
    const [ users, setUsers ] = useState<user[]>([])
    const [ warning, setWarning ] = useState('')

    useEffect(()=>{
        api.get('/users').then(response =>{
            setUsers(response.data)
        })
    },[])
  
    function handleSignOn(){
        const count = users.filter(user =>{
            return user.username === email; 
        })

        console.log(count)
        if(count.length > 0){
            setWarning("Usuário ja existente!")
            return
        }
        try{
            api.post('/users/create',{"name" : name, "username": email, "role": permission}).then(()=>{
                    setPopup(true)
                }
            )
        }catch(err){
            return
        }
    }

    function handleLogOut(){
        logout()
        history.push('/login')
    }

    function Popup(){
        return(
                <div className="SentEmailMessage">
                    <span>Email enviado com sucesso! Olhe na sua caixa principal ou na sua caixa de spam :P</span>
                    <button type='button' onClick={()=>{ setPopup(false) }}>Confirmar</button>
                </div>
        )
   }

        return( 
            <div id="dashboard">

                <CSSTransition
                in={popup}
                timeout={300}
                classNames="alert"
                unmountOnExit
                >
                    <Popup/>
                </CSSTransition>
                <aside className='app-sidebar'>
                    <img src={mapMarkerImg} alt="Happy" />
            
                    <div className='registrations'>
                        <Link to='/dashboard/registrated' className='registrations-button'>
                            <FiMapPin size={24} color="#FFF" />
                        </Link>

                        <Link to='/dashboard/pendents' className='registrations-button'>
                            <FiAlertCircle size={24} color="#FFF" />
                        </Link>

                        <Link to='/dashboard/create-users' className='registrations-button active'>
                            <FiUserPlus size={24} color="#0089A5" />
                        </Link>

                        <Link to='/dashboard/users' className='registrations-button'>
                            <FiUser size={24} color="#FFF" />
                        </Link>
                    </div>

                    <footer className='footer'>
                        <button type='button' onClick={() => { history.push('/')}}>
                                <FiArrowLeft size={24} color='#fff'/>
                        </button>

                        <button type="button" onClick={handleLogOut}>
                            <FiPower size={24} color="#FFF" />
                        </button>
                        </footer>
                </aside>

                <main>  
                    <div className="container">
                        <div className='top'>
                            <h2>Cadastrar usuários</h2>      
                        </div>
                        <div className='content'>  
                        
                            <div className='block'>
                                <span>E-mail:</span>
                                <div>
                                    <FiAtSign size={20} color='gray' />
                                    <input type='email' placeholder='Digite o e-mail' onChange={(event)=>{
                                        setEmail(event.target.value)
                                    }}/>
                                </div>
                                

                                <span>Nome:</span>
                                <div>
                                    <FiUser size={20} color='gray' />
                                    <input type='text' placeholder='Digite o nome' onChange={(event)=>{
                                        setName(event.target.value)
                                    }}/>
                                </div>

                                <span>Permissão:</span>
                                <div className='radioDiv'>
                                    <div>
                                        <label htmlFor="admin">Administrador</label>
                                        <input type='radio' id='admin' name='permission' className='radio' onClick={()=>{
                                            setPermission('admin')
                                        }}/>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="user">Usuário</label>
                                        <input type='radio' id='user' name='permission' className='radio' onClick={()=>{
                                            setPermission('user')
                                        }}/>
                                    </div>                
                                </div>

                                <span id='warning'>{warning}</span>
                               
                                {email && name && permission ? (
                                    <button type='button' onClick={handleSignOn}>Cadastrar</button>
                                ) : (
                                    <div  className='disabled'>Cadastrar</div>
                                )}
                                
                            </div>
                   
                        </div>
                    </div>
                    <div/>
                </main>
            </div>
        
    )
}