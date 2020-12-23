import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import '../../styles/pages/DeleteOrphanage.css'
import DeleteImg from '../../images/Delete.svg'
import { FiCheck , FiXCircle} from 'react-icons/fi'
import api from '../../services/api'


interface Orphanage{
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    approved: boolean
}
interface OrphanageParams {
    id: string
  }

export default function DeleteOrphanage(){
    const history = useHistory()
    const { goBack} = useHistory()
    const params = useParams<OrphanageParams>()
    const [ orphanage, setOrphanage] = useState<Orphanage>()

    useEffect(()=> {
        api.get(`orphanages/${params.id}`).then(response => {
            setOrphanage(response.data)
        })
    }, [params.id])

    if(!orphanage){
        return <p>Carregando...</p>
      }
      

    async function handleDelete() {

        try{
            await api.delete(`/orphanages/delete/${params.id}`)
            history.push('/dashboard/registrated')
        } catch {
            console.error('deu ruim ai mano')
        }
    }

    return(
        <div id="Delete-page">
            <div className="content-wrapper">
                <main>
                    <h1>Excluir!</h1>
                     <p>Você tem certeza que quer excluir {orphanage?.name}?</p>
                    <div className='buttons-yes-no'>

                        <button type='button' className='no' onClick={goBack}>
                            <FiXCircle size={24} color='#fff'/>Não
                        </button>
                        <button type='button' className='yes' onClick={handleDelete}>
                            <FiCheck size={24} color='#fff'/>Sim
                        </button>
                        
                    </div>
                </main>
                <img src={DeleteImg} alt="Happy" />
            </div>
        </div>
    )
}