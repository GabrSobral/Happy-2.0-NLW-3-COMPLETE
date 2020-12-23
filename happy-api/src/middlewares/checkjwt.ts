import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const authHeader = <string>req.headers.authorization;

  if(!authHeader){
    return res.status(401).send({ error: 'No token  Provided' })
  }
  
  let jwtPayload;
  
  //Try to validate the authHeader and get data
  try {
    jwtPayload = <any>jwt.verify(authHeader, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If authHeader is not valid, respond with 401 (unauthorized)
    res.status(401).send({ error : 'Token invalid'});
    return;
  }

  //The authHeader is valid for 1 hour
  //We want to send a new authHeader on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: 864000
    
  });
  res.setHeader("authHeader", newToken);

  //Call the next middleware or controller
  next();
};