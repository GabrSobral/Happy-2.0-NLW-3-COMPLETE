import { Request, Response } from "express";
import { getManager, getConnection, getRepository } from "typeorm";
import * as Yup from 'yup';

import orphanagesView from '../views/orphanages_view';
import Orphanage from "../models/Orphanage";
import Image from '../models/Image'
import images_view from "../views/images_view";


export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
  
    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });
  
    return response.json(orphanagesView.renderMany(orphanages));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });
  
    return response.json(orphanagesView.render(orphanage));
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      phone_number,
      approved,
    } = request.body;

    const orphanagesRepository = getRepository(Orphanage);
    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return {
        path: image.filename,
      }
    });

    console.log(images)

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends == 'true',
      phone_number,
      approved: approved == 'true',
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean(),
      phone_number: Yup.string(),
      approved: Yup.boolean(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ).required().min(1),
    });

    await schema.validate(data, {
      abortEarly: false,
    });
    console.log(data)

    const orphanage = orphanagesRepository.create(data);
  
    await orphanagesRepository.save(orphanage);
  
    return response.status(201)
      .json(orphanagesView.render(orphanage));
  },

  async orphanageDelete(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;
  
    const orphanagesRepository = getRepository(Orphanage);
    let orphanage: Orphanage;
    try {
      orphanage = await orphanagesRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Orphanage not found");
      return;
    }
    orphanagesRepository.delete(id);
  
    //After all send a 204 (no content, but accepted) response
    res.status(204).send('Orphanage deleted!');
  },

  async editOrphanages(req: Request, res: Response){
  const id = req.params.id;

    //Get values from the body
  let {
    name,
    latitude,
    longitude,
    about,
    instructions,
    opening_hours,
    open_on_weekends,
    phone_number,
    approved,
  } = req.body;

  const orphanagesRepository = getManager().getRepository(Orphanage);
  let orphanage = new Orphanage

  console.log(orphanage)

  const requestImages = req.files as Express.Multer.File[];
 
      try {
        orphanage = await orphanagesRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("Orphanage not found");
        return;
      }

       const images = requestImages.map((image) => {
          return { path: image.filename }
      }) 
      
      try{
          orphanage.name = name;
          orphanage.latitude = latitude;
          orphanage.longitude = longitude;
          orphanage.about = about;
          orphanage.instructions = instructions;
          orphanage.opening_hours = opening_hours;
          orphanage.open_on_weekends = open_on_weekends == 'true';
          orphanage.phone_number = phone_number,
          orphanage.approved = approved == 'true';
          // orphanage.images = images as Image[]
      } catch (err){
        res.status(401).send({error : "error in change the data"})
      }

      const schema = Yup.object().shape({
      name: Yup.string(),
      latitude: Yup.number(),
      longitude: Yup.number(),
      about: Yup.string().max(300),
      instructions: Yup.string(),
      opening_hours: Yup.string(),
      open_on_weekends: Yup.boolean(),
      phone_number: Yup.string(),
      approved: Yup.boolean(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string(),
        })
      )
    });

    await schema.validate(orphanage, {
      abortEarly: false,
    });

    console.log(orphanage)
    // try{
    //   await orphanagesRepository.update(orphanage.id, orphanage);
    //   console.log("deu certo");
      
    // }catch(erro){

    //   return res.status(400).send(erro);
    // }

    try{
      await orphanagesRepository.save(orphanage)
    } catch(err){
      res.status(500).send(err)
    }

  return res.status(200).send(orphanage)
  },
}
