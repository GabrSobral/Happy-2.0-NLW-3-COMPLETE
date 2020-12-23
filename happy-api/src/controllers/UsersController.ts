import { Request, response, Response } from "express";
import { getRepository } from "typeorm";
import * as Yup from 'yup';
import User from "../models/users";
import users_view from "../views/users_view";
import crypto from 'crypto'

import * as bcrypt from "bcrypt";

import sendEmail from "../modules/mailer";

let user: User;

export default {
  async listAll(req: Request, res: Response) {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "role", "createdAt", "name"] //We dont want to send the passwords on response
    });
  
    //Send the users object
    return res.json(users_view.renderMany(users))
  },
  
  async getOneById(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;
  
    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "username"] //We dont want to send the password on response
      });
      return res.json(users_view.render(user));
    } catch (error) {
      res.status(404).send("User not found");
    }
    
  },
  
  async newUser(req: Request, res: Response) {

    const {username, name, role} = req.body;

    const userRepository = getRepository(User);

    if(await userRepository.findOne({username}))
     return res.status(400).send({error: "User Already Exists"})  

    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 12)

    const data = {
      "username": username,
      "password":token,
      "name": name,
      "role": role,
      "passwordResetExpires": now,
      "passwordResetToken": token};

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      username: Yup.string().required(),
      password: Yup.string().required(),
      role: Yup.string().required(),
      passwordResetExpires: Yup.date(),
      passwordResetToken: Yup.string()
    });

    

    await schema.validate(data, {
      abortEarly: false,
    });
    data.password = bcrypt.hashSync(data.password, 10);

    console.log(data)
    
    console.log(user)

    user = userRepository.create(data);

    await userRepository.save(user);

    sendEmail(username, token)
  
    return res.status(201)
      .json(users_view.render(user));

  },
   
  async deleteUser(req: Request, res: Response) {
    //Get the ID from the url
    const id = req.params.id;
  
    const userRepository = getRepository(User);
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);
  
    //After all send a 204 (no content, but accepted) response
    res.status(204).send('User deleted!');
  }
}
