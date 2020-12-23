import React, { useEffect, useState }from 'react'

import { FiPlus, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

import { Link} from 'react-router-dom'

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanages-map.css'

import 'leaflet/dist/leaflet.css'
import api from '../services/api'

import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import mapIcon from '../utils/mapIcon'

interface Orphanage{
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    approved: boolean
}


function OrphanagesMap(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const [ currentLatitude, setCurrentLatitude ] = useState(-20)
    const [ currentLongitude, setCurrentLongitude ] = useState(-46)
    const [ zoom, setZoom ] = useState(5)

    useEffect(()=> {
        const ApprovedOrphanages : Array<Orphanage> = []
        api.get('orphanages').then(response => {

            response.data.map((orphanage : Orphanage) =>{ 
                if(orphanage.approved){ 
                  ApprovedOrphanages.push(orphanage)
              }      
              return ApprovedOrphanages   
          })
          setOrphanages(ApprovedOrphanages)
        })
    }, [])

    navigator.geolocation.getCurrentPosition((pos)=>{
        const crd = pos.coords;
        setCurrentLatitude(crd.latitude)
        setCurrentLongitude(crd.longitude)
        setZoom(13)
    })

    
    return(
        <div id='page-map'>
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>
                <footer>
                    <strong>Santos</strong>
                    <span>São Paulo</span>
                </footer>
                
                <Link to='/'>
                    <FiArrowLeft size={24} color='#fff'/>
                </Link>
            </aside>
            <Map
                center={[currentLatitude, currentLongitude]}
                zoom={zoom}
                style={{width:'100%' , height:'100%'}}
            >
                <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}/> 
                
                {orphanages.map(orphanage => {
                   if(!orphanage.approved){ return console.log() }
                    return(
                        <Marker
                            icon={mapIcon}
                            position={[orphanage.latitude,orphanage.longitude]}
                            key={orphanage.id}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className='map-popup'>
                               {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color='#fff'/>
                                </Link>
                            </Popup>

                        </Marker>
                    )
                })}

            </Map> 

            <Link to='/orphanages/create' className='create-orphanage'>
                <FiPlus size={32} color='#fff'/>
            </Link>
        </div>
    )
}
export default OrphanagesMap