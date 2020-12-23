/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
// import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo, FiArrowRight, FiArrowLeft} from "react-icons/fi";
import { FaWhatsapp} from "react-icons/fa";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom'


import '../styles/pages/orphanage.css';
import SideBar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import ReactLoading from "react-loading";

interface Orphanage {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    path: string;
  }>;
}

interface OrphanageParams {
  id: string
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>()
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [count, setCount] = useState(0)
  const moreImagesDiv : any = useRef(null)
  const moreImagesButton : any = useRef(null)

  useEffect(()=> {
      api.get(`orphanages/${params.id}`).then(response => {
          setOrphanage(response.data)
          setCount(response.data.images.length)          
      })
  }, [params.id])

if(!orphanage){
  return <div className='loading'> <ReactLoading type={'spin'} color='#12AFCB'/></div>
}

function handleMoreImages(){
  moreImagesDiv.current.scrollLeft += 168

  if(activeImageIndex < count - 1){
    setActiveImageIndex(activeImageIndex + 1)

  } else{

    setActiveImageIndex(0)
    moreImagesDiv.current.scrollLeft = 0
  } 
}

function handleMoreImagesBack(){
  moreImagesDiv.current.scrollLeft -= 168

  if(activeImageIndex > 0){
    setActiveImageIndex(activeImageIndex - 1)

  } else{
    setActiveImageIndex(count - 1)
    moreImagesDiv.current.scrollLeft = 168 * (count -1)
  } 
}

  return (
    <div id="page-orphanage">
     <SideBar/>

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].path} alt={orphanage.name} />
      
          <div className="orphanage-details-content">

            <h1>{orphanage.name}</h1>

            <p>
              {orphanage.about}
            </p>
          <div className="BackImagesNext">
            {orphanage.images.length > 3 && (
                  <button type='button' ref={moreImagesButton} className='moreImagesBack' onClick={handleMoreImagesBack}>
                    <FiArrowLeft size={24} color='#29B6D1'/>
                  </button>            
            )}

          <div className="images" ref={moreImagesDiv}>
            {orphanage.images.map((image, index) => {
                return(
                  <button
                    key={image.id}
                    className={activeImageIndex === index ? "active" : ""}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(index);
                    }}
                  >
                    <img src={image.path} alt={orphanage.name} />
                  </button>
                )
            })}
            
          </div>

          {orphanage.images.length > 3 && (
                  <button type='button' ref={moreImagesButton} className='moreImages' onClick={handleMoreImages}>
                    <FiArrowRight size={24} color='#29B6D1'/>
                  </button>     
          )}

          </div>
          

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a target='_blank' rel='noopener noreferrer' href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>

              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#ff6690" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </div>

            <button type="button" className="contact-button">
                <FaWhatsapp size={20} color="#FFF" />
                Entrar em contato
              </button>
          </div>
        </div>
      </main>
    </div>
  );
}