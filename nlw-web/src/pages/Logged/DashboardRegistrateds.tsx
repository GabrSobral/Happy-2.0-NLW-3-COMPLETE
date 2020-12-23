import React, { useEffect, useState } from 'react'
import mapMarkerImg from '../../images/map-marker.svg'
import { FiPower, FiMapPin, FiAlertCircle, FiEdit3, FiTrash, FiArrowLeft, FiSearch, FiUserPlus, FiUser } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from "react-leaflet";

import '../../styles/pages/Dashboard.css'
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';
import { logout } from '../../services/auth';

import { useRole } from '../Login'

import ReactLoading from "react-loading";

interface Orphanage{
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    approved: boolean
}

export default function Dashboard(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const [count, setCount] = useState(0)
    const history = useHistory()
    const [ search, setSearch ] = useState('')
    const [ done, setDone ] = useState(false)

    const { role } = useRole()

    console.log('role ', role)
    
    const SearchData : Array<Orphanage> = []

    function handleLogOut(){
        logout()
        history.push('/login')
    }


    useEffect(()=>{

        async function get(){
            const ApprovedOrphanages : Array<Orphanage> = []
            await api.get('/orphanages').then( response =>{
                setDone(true)
         
                response.data.map((orphanage : Orphanage) =>{ 
                      if(orphanage.approved){ 
                        ApprovedOrphanages.push(orphanage)
                    }      
                    return ApprovedOrphanages   
                })
                setOrphanages(ApprovedOrphanages)
                setCount(ApprovedOrphanages.length)
            })  
        }
        get()
                                
    }, [])

    useEffect(()=>{
        setCount(SearchData.length)
    },[SearchData])


        return(
            <div id="dashboard">
                    <aside className='app-sidebar'>
                        <img src={mapMarkerImg} alt="Happy" />
                
                        <div className='registrations'>
                            <Link to='/dashboard/registrated' className='registrations-button active'>
                                <FiMapPin size={24} color="#0089A5" />
                            </Link>

                            <Link to='/dashboard/pendents' className='registrations-button'>
                                <FiAlertCircle size={24} color="#FFF" />
                            </Link>
                            {
                                role === 'admin' && ( 
                                    <>
                                    <Link to='/dashboard/create-users' className='registrations-button'>
                                        <FiUserPlus size={24} color="#FFF" />
                                    </Link>

                                    <Link to='/dashboard/users' className='registrations-button'>
                                        <FiUser size={24} color="#FFF" />
                                    </Link>
                                    </>
                                 )
                            }
                        </div>

                        <footer className='footer'>
                            <button type='button' onClick={() => { history.push('/')}}>
                                <FiArrowLeft size={24} color='#fff'/>
                            </button>
                            
                            <button type='button' onClick={handleLogOut}>
                                <FiPower size={24} color="#FFF" />
                            </button>
                        </footer>
                    </aside>


                <main>
                    <div className="container">
                        <div className='top'>
                            <h2>Orfanatos cadastrados</h2>
                            <div className='CountAndOrphanages'>
                                <div>
                                    <FiSearch size={20} color="gray" className='iconSearch'/>
                                    <input 
                                        type='text' 
                                        placeholder='Pesquisa...' 
                                        onChange={(event)=>{ 
                                            setSearch(event.target.value)
                                        }}/>
                                </div>
                                
                                <span className='results'>{count} orfanatos</span>
                            </div>
                        </div>
                        <div className='content'>

                            { !done ? (
                                <div className='dontHaveOrphanages'>
                                    <ReactLoading type={'spin'} color='#12AFCB'/>
                                </div>
                            
                            ) : (console.log()) }
                            
                            {orphanages.filter(val =>{

                                if(search === ''){
                                    return val
                                }else if(val.name.toLowerCase().includes(search.toLowerCase())){
                                    return val
                                }
                                return console.log("")

                            }).map((orphanage) => {   
                                SearchData.push(orphanage)
                                    return(
                                                    
                                        <div className="orphanage" key={orphanage.id}>
                                            <div className="map-container">
                                                <Map 
                                                    center={[orphanage.latitude, orphanage.longitude]} 
                                                    zoom={16} 
                                                    style={{ width: '100%', height: 240 }}
                                                    dragging={false}
                                                    touchZoom={false}
                                                    zoomControl={false}
                                                    scrollWheelZoom={false}
                                                    doubleClickZoom={false}
                                                >
                                                    <TileLayer 
                                                    url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                                                    />
                                                    <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude,orphanage.longitude]} />
                                                </Map>
                                            </div>

                                            <footer>
                                                <span className='orphanage-name'>{orphanage.name}</span>
                                                <div>
                                                    <Link to={`/orphanages/update/${orphanage.id}`}>
                                                        <FiEdit3 size={24} color="#15C3D6"/>
                                                    </Link>
                                                    <Link to={`/orphanages/delete/${orphanage.id}`}>
                                                        <FiTrash size={24} color="#15C3D6"/>
                                                    </Link>
                                                </div>
                                            </footer>
                                    
                                        </div>
        
                                    )
                            })}  

                            {(orphanages.length === 0 || count === 0) && done ? (
                                <div className='dontHaveOrphanages'>
                                <svg width="79" height="88" viewBox="0 0 79 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M78.2222 22.3313V53.4038C78.2222 65.7365 67.9024 75.7351 55.1736 75.7351H52.8424L40.9373 87.2622C40.471 87.7139 39.826 88 39.1111 88C38.4506 88 37.8522 87.7666 37.3937 87.3751L37.1917 87.1793L37.1839 87.1718L25.3799 75.7351H23.0408C10.3198 75.7351 0 65.7365 0 53.4038V22.3313C0 9.99863 10.3198 0 23.0486 0H55.1736C67.9024 0 78.2222 9.99863 78.2222 22.3313Z" fill="#D3E2E5"/>
                                    <path d="M30.7304 32.3808H17.0381V25.6901C17.0381 21.9967 20.1049 18.9995 23.8842 18.9995C27.6636 18.9995 30.7304 21.9967 30.7304 25.6901V32.3808Z" fill="white"/>
                                    <path d="M59.6479 32.3808H45.9556V25.6901C45.9556 21.9967 49.0224 18.9995 52.8017 18.9995C56.581 18.9995 59.6479 21.9967 59.6479 25.6901V32.3808Z" fill="white"/>
                                    <rect x="25.667" y="47.667" width="25.6667" height="11" rx="4" fill="white"/>
                                </svg>
                                <span>Nenhum no momento</span>
                            </div>
                            ) : console.log()}     
                        </div>
                    </div>
                <div/>
            </main>
        </div>
             
    )
}