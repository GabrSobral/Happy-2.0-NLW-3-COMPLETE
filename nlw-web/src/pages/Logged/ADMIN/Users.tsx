import React, { useEffect, useRef, useState } from 'react'
import mapMarkerImg from '../../../images/map-marker.svg'
import { FiPower, FiMapPin, FiAlertCircle, FiArrowLeft, FiSearch, FiUserPlus, FiUser, FiTrash, FiCheck, FiX} from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';

import '../../../styles/pages/Users.css'
import api from '../../../services/api';
import { logout } from '../../../services/auth';

import { CSSTransition } from 'react-transition-group'

import jwt_decode from "jwt-decode";
import { getToken } from '../../../services/auth'
import ReactLoading from "react-loading";
import { parseISO, format} from 'date-fns'

interface User{
    id: number,
    name: string,
    username: string,
    createdAt: string,
    role: string,
}
interface TokenData{
    userID: number,
    username: string,
    iat: number,
    exp: number
}

export default function Dashboard(){
    const [users, setUsers] = useState<User[]>([]);
    const [count, setCount] = useState(0)
    const history = useHistory()
    const [ search, setSearch ] = useState('')
    const [ popup, setPopup ] = useState(false)
    const [ done , setDone] = useState(false)
    
    const id = useRef<number>(0)
    const [ username, SetUsername ] = useState('')
    const [ name, SetName ] = useState('')
    const [ role, setRole ] = useState('')
    const [ createdAt, setCreatedAt ] = useState('')
    let [render , setRender] = useState(false)
    const TokenData = useRef<TokenData>()

    TokenData.current = jwt_decode(getToken() as string)

    let parsedDate : Date
    
    const SearchData : Array<User> = []

    function handleLogOut(){
        logout()
        history.push('/login')
    }

    useEffect(()=>{
            api.get('/users').then((response)=>{
                setUsers(response.data)
                setCount(response.data.length)
                setDone(true)
            })                
    }, [render])

    useEffect(()=>{
        setCount(SearchData.length)
        console.log("counter mudado", SearchData)
    },[SearchData])

    function DateParser(date: string){
        parsedDate = parseISO(date)

        const formattedDate = format(
            parsedDate, 
            "dd'/'MM'/'yyyy '-' HH:mm"
          );

          return formattedDate
    }
    async function handleDelete(id: number){
        await api.delete(`/${id}`).then(()=>{
            setPopup(false)
            console.log("render " , render)
            render === true ? (render = false) : (render = true)
            setRender(render)
            console.log("render " , render)
        })
        
    }


    function PopupDelete(){

        return(
   
                <div className='backgrondPopup'>
                     
                      <div className='User'>
                            <span className='WishYouDelete '>Deseja apagar:</span>
                            <div className='name-user'><span><strong>Nome: </strong>{name}</span></div>
                            <div className='email-user'><span><strong>Email: </strong>{username}</span></div>
                            <div className='role-user'><span><strong>Função: </strong>{role === 'admin' ? 'Administrador' : 'Usuário'}</span></div>

                            <footer className='options'>
                                <span className='createdAt'>Criado em: {createdAt}</span>          
                            </footer>

                            <div className="buttonsPopupDelete">
                                <button type='button' className='yes' onClick={()=>{
                                    handleDelete(id.current)        
                                }}>
                                    <FiCheck size={24} color="#FFF" />
                                    Sim</button>
                                <button type='button' onClick={()=>{ setPopup(false) }}>
                                <FiX size={24} color="#FFF" />
                                    Não
                                </button>
                            </div>
                      </div>  
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
                    <PopupDelete/>  
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

                        <Link to='/dashboard/create-users' className='registrations-button'>
                            <FiUserPlus size={24} color="#FFF" />
                        </Link>

                        <Link to='/dashboard/users' className='registrations-button active'>
                            <FiUser size={24} color="#0089A5" />
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

                            <h2>Usuários</h2>
                            <div className='CountAndOrphanages'>
                                <div>
                                    <FiSearch size={20} color="gray" className='iconSearch'/>
                                    <input type='text' placeholder='Pesquisa...' onChange={(event)=>{ setSearch(event.target.value)}}/>
                                </div>
                                
                                <span className='results'>{count} usuários</span>
                            </div>
                            
                        </div>

                        { !done && (

                            <div className='loadingUsers'>
                                <ReactLoading type={'spin'} color='#12AFCB'/>
                            </div>

                        )}
                         {(users.length === 0 || count === 0) && done ? (
                                <div className='dontHaveUsers'>
                                <svg width="79" height="88" viewBox="0 0 79 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M78.2222 22.3313V53.4038C78.2222 65.7365 67.9024 75.7351 55.1736 75.7351H52.8424L40.9373 87.2622C40.471 87.7139 39.826 88 39.1111 88C38.4506 88 37.8522 87.7666 37.3937 87.3751L37.1917 87.1793L37.1839 87.1718L25.3799 75.7351H23.0408C10.3198 75.7351 0 65.7365 0 53.4038V22.3313C0 9.99863 10.3198 0 23.0486 0H55.1736C67.9024 0 78.2222 9.99863 78.2222 22.3313Z" fill="#D3E2E5"/>
                                    <path d="M30.7304 32.3808H17.0381V25.6901C17.0381 21.9967 20.1049 18.9995 23.8842 18.9995C27.6636 18.9995 30.7304 21.9967 30.7304 25.6901V32.3808Z" fill="white"/>
                                    <path d="M59.6479 32.3808H45.9556V25.6901C45.9556 21.9967 49.0224 18.9995 52.8017 18.9995C56.581 18.9995 59.6479 21.9967 59.6479 25.6901V32.3808Z" fill="white"/>
                                    <rect x="25.667" y="47.667" width="25.6667" height="11" rx="4" fill="white"/>
                                </svg>
                                <span>Nenhum no momento</span>
                            </div>
                            ) : console.log()}

                        <div className='contentUser'>  

                       
                        
                        {users.filter(val =>{
                                
                                if(search === ''){
                                    return val
                                }else if(val.name.toLowerCase().includes(search.toLowerCase()) ||
                                         val.username.toLowerCase().includes(search.toLowerCase()) ||
                                         val.role.toLowerCase().includes(search.toLowerCase())){
                                    return val
                                }
                                return console.log()

                            }).map((user) => {
                                if(TokenData.current?.username === user.username){
                                    return console.log()
                                }
                                SearchData.push(user)
                                    return(
                                        <div className='User' key={user.id}>
                                            <div className='name-user'><span><strong>Nome: </strong>{user.name}</span></div>
                                            <div className='email-user'><span><strong>Email: </strong>{user.username}</span></div>
                                            <div className='role-user'><span><strong>Função: </strong>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</span></div>

                                            <footer className='options'>
                                            <span className='createdAt'>Criado em: {DateParser(user.createdAt)}</span>          

                                                <button type='button' onClick={()=>{
                                                    id.current = user.id
                                                    SetUsername(user.username) 
                                                    SetName(user.name)
                                                    setRole(user.role)
                                                    setCreatedAt(DateParser(user.createdAt))
                                                    setPopup(true)
                                                    PopupDelete()
                                                }}>
                                                        <FiTrash size={27} color=' #12AFCB'/>
                                                </button>                     
                                            </footer>
                                         </div>  
                                    )
                            })}
                                       
                        </div>
                    </div>
                    <div/>
                </main>
            </div>
    )
}