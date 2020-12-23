import React, { useState, FormEvent, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'

import {FiPlus, FiX} from "react-icons/fi";

import SideBar from '../components/SideBar'

import '../styles/pages/create-orphanage.css';
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";

interface Orphanage{
  latitude: number,
  longitude: number,
  name: string,
  about: string,
  instructions: string,
  opening_hours: string,
  open_on_weekends: string,
  images: Array<{
    id: number,
    url: string
  }>
}

export default function CreateOrphanage() {
  const history = useHistory()

  const [position, setPosition ] = useState({latitude : 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [phone, setPhone] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])


  

  function handlerMapClick(event : LeafletMouseEvent){
    const {lat, lng} = event.latlng
    setPosition({
      latitude: lat,
      longitude: lng
    })
  }
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = (Array.from(event.target.files))

    selectedImages.map(image => {
      return images.push(image)
    })
    setImages(images);

    const selectedImagesPreview = images.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }

  function handleDeleteImage(pos: number){

    images.splice(pos, 1)

    const selectedImagesPreview = images.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);

    return 
  }

  async function handlerSubmit(event: FormEvent){
    event.preventDefault()

    const { latitude, longitude} = position

    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('phone_number', phone)
    data.append('open_on_weekends', String(open_on_weekends))

    images.forEach(image => {
      data.append('images', image)

      console.log(phone)
    })

    await api.post('/orphanages', data)
    history.push('/orphanages/success')

  }

  function replacer( match : string, g1 : string, g2 : string, g3 : string) {
    let output = ''
          if ( g1.length ) {
            output = "(" + g1;
            if ( g1.length === 2 ) {
                output += ")";
                if ( g2.length ) {
                    output += " " + g2; 
                    if ( g2.length === 4 ) {
                        output += " - ";
                        if ( g3.length ) {
                            output += g3;
                        }
                    }
                }
             }
          }
    return output
  } 

  function getFormattedPhoneNum( input : string) {
    
    let phoneNumber = input.replace( /^\D*(\d{0,3})\D*(\d{0,4})\D*(\d{0,4})/,   replacer);        
    setPhone(phoneNumber);
   }     

  return (
    <div id="page-create-orphanage">
      <SideBar/>

      <main>
        <form onSubmit={handlerSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.9568195,-46.3385621]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handlerMapClick}
            >
              <TileLayer 
                url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
              />

              { position.latitude !== 0 &&
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude,
                    position.longitude
                  ]} 
                />
               }

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>

              <input 
              id="name" 
              value={name} 
              onChange={(
                event => setName(event.target.value)
                )}
              />

            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" 
              maxLength={300}
              value={about} 
              onChange={(
                event => setAbout(event.target.value)
                )} 
                />
            </div>

            <div className="input-block">
              <label htmlFor="phone">Número de Whatsapp</label>

              <input 
              id="phone" 
              value={phone} 
              type="tel"
              maxLength={16}
              minLength={9}
              placeholder="(xx) xxxx-xxxx"
              onChange={(
                event => getFormattedPhoneNum(event.target.value)
                )}
              />

            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  var ImageIndex = previewImages.indexOf(image)
                  return (
                    <div className='image-block' key={image}>
                      <img src={image} alt={name} />
                      <button 
                        type='button'
                        className='DeleteImage'
                        onClick={() => {handleDeleteImage(ImageIndex)}}>

                          <FiX size={24} color="#FF669D"/>
                      </button>
                    </div>
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input
                type="file"
                id="image[]"
                multiple
                onChange={handleSelectImages}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
              id="instructions"
              value={instructions} 
              onChange={(
                event => setInstructions(event.target.value)
                )}
               />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours" 
                value={opening_hours} 
                onChange={(
                event => setOpeningHours(event.target.value)
                )}
                />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}>
                    Sim
                </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}>
                    Não
                </button>
              </div>
            </div>
          </fieldset>
          
          { name && about && position && instructions && opening_hours && previewImages ? (
              <button 
                className="confirm-button" 
                type="submit" >
                Confirmar
              </button>
          ) : (
              <div  className='disabled'>Confirmar</div>
          )}
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
