import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

import User from '../models/users'
import config from '../config'
import sendEmail from "../modules/mailer";

let user: User;

export default{
   async login(request: Request, response : Response){
     
    let { username, password } = request.body;
    if (!(username && password)) {
      response.status(400).send({ error : 'user not found'});
    }

    //Get user from database
    const userRepository = getRepository(User);
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (err) {
      response.status(401).send();
      return
    }

    //Check if encrypted password match
    if (!await bcrypt.compare(password, user.password)) {
      response.status(401).send({error :"Invalid password"});
      return;
    }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: "1h" }
  );
    response.status(201).json({user, token});
  },
  
  async changePassword(request: Request, response: Response){
    
    //Get ID from JWT
    const id = response.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = request.body;
    if (!(oldPassword && newPassword)) {
      response.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      response.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      response.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      response.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    response.status(204).send();
  },
  
  async forgotPassword(request: Request, response : Response){
    const { username } = request.body

    const userRepository = getRepository(User);

    try{
      user = await userRepository.findOneOrFail({ where: { username } });
        if(!user) response.status(400).send({ error : 'user not found'});

          const token = crypto.randomBytes(20).toString('hex')

          const now = new Date()
          now.setHours(now.getHours() + 1)

        user.passwordResetExpires = now;
        user.passwordResetToken = token

        await userRepository.save(user)

        console.log("Chegou até o trasport aaaaaaaaaaaaaaaaaaaaaaaaaaaa")

       sendEmail(username, token)

      
    }catch(err){
      return response.status(400).send({error: "Error on forgot password, try again"})
    }
    response.status(200).send("Sent Email")
  },

  async resetPassword(request : Request, response : Response){
    let { username, token, password} = request.body

    const userRepository = getRepository(User);

    try{
      user = await userRepository.findOneOrFail({ username });
      const UserToken = user.passwordResetToken
      const expire = user.passwordResetExpires

      if(!user) response.status(400).send({ error : 'user not found'});

      if(token !== UserToken) return response.status(400).send({error : "invalid token of reset password"})

      const now = new Date()
      if(now > expire) return response.status(400).send({error : "Token expired"})

      password = bcrypt.hashSync(password, 10);
      user.password = password

      await userRepository.save(user)
      response.send(200)
    }
    catch(err){
      response.status(400).send({error : "Error to reset password, please try again"})
      console.log(err)
    }
  }
}