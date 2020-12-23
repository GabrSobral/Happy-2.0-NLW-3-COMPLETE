/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'

import {FiPlus, FiXCircle, FiCheck, FiX } from "react-icons/fi";

import SideBar from '../../components/SideBar'

import '../../styles/pages/create-orphanage.css';
import mapIcon from "../../utils/mapIcon";
import api from "../../services/api";
import { useHistory, useParams } from "react-router-dom";

interface Orphanage{
  id: number,
  latitude: number,
  longitude: number,
  name: string,
  instructions: string,
  about: string,
  opening_hours: string,
  open_on_weekends: boolean,
  approved: boolean,
  images: Array<{
    id: number,
    url: string
  }>
}
interface OrphanageParams {
  id: string
}

export default function UpdateOrphanage() {  
  const { goBack } = useHistory()
  const history = useHistory()

  const [position, setPosition ] = useState({latitude : 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [approved, setApproved] = useState(false)
  const [phone, setPhone] = useState('')

  const params = useParams<OrphanageParams>()
  const [orphanage, setOrphanage] = useState<Orphanage>();

  useEffect(()=> {
      api.get(`orphanages/${params.id}`).then(response => {
          setOrphanage(response.data)
          
          setName(response.data.name)
          setAbout(response.data.about)
          setInstructions(response.data.instructions)
          setOpeningHours(response.data.opening_hours)
          setOpenOnWeekends(response.data.open_on_weekends)
          setImages(response.data.images)
          setPhone(response.data.phone_number)
          setPosition({
            latitude: response.data.latitude,
            longitude: response.data.longitude
          })  


      })
  }, [params.id])

  if(!orphanage){
    return <p> Carregando...</p>
  }

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
    console.log(images)
    setImages(images);

    const selectedImagesPreview = images.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }


  function handleDeleteImage(pos: number){
    console.log(pos, images)

    images.splice(pos, 1)

    const selectedImagesPreview = images.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
    console.log(images)

    return 
  }

  async function reject(){ 
    history.push(`/orphanages/delete/${params.id}`)
  }

  async function handlerSubmit(event: FormEvent){
    console.log(approved)

    event.preventDefault()
   
    const { latitude, longitude} = position

    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    data.append('phone_number', phone)
    data.append('approved', String(approved))

    images.forEach(image => {
      data.append('images', image)
    })

    console.log({
      name,
      about,
      latitude,
      longitude,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
      approved,
      previewImages
  })
    try{
      await api.put(`/orphanages/${params.id}`, data)
      history.push('/dashboard/registrated')
    }catch(err){
      alert(err)
    }


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
              center={[position.latitude, position.longitude]} 
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
                {previewImages.map((image : any) => {
                  var ImageIndex = previewImages.indexOf(image)
                  return (
                    <div className='image-block'>
                      <img key={image.id} src={image.path} alt={name} />
                    </div>
                  )
                })}

              </div>

            
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

            <div className="aprove-reject">
                <button className='reject-button' type='button' onClick={reject}>
                    <FiXCircle size={24} color='#fff'/> Rejeitar
                </button>

                <button className="aprove-button" type="submit" onClick={() => setApproved(true)}>
                    <FiCheck size={24} color='#fff'/>Aprovar
                </button>
            </div>
        </form>
             
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
