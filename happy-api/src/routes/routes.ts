import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import OrphanagesController from '../controllers/OrphanagesController';

import multer from 'multer';
import multerConfig from '../config/multer';

import UsersController from '../controllers/UsersController';

import { checkJwt } from '../middlewares/checkjwt'
import { checkRole } from '../middlewares/checkRole';

const routes = Router()
const upload = multer(multerConfig);

//auth
routes.post("/login", AuthController.login);
routes.post("/change-password", [checkJwt], AuthController.changePassword);
routes.post('/forgot-password', AuthController.forgotPassword)
routes.post('/reset-password', AuthController.resetPassword)

//orphanage
routes.get( '/orphanages', OrphanagesController.index );
routes.get( '/orphanages/:id', OrphanagesController.show );
routes.post( '/orphanages', upload.array('images'), OrphanagesController.create )

routes.delete( '/orphanages/delete/:id',
[checkJwt],
 OrphanagesController.orphanageDelete)

routes.put( '/orphanages/:id',  upload.array('images'),
[checkJwt],
OrphanagesController.editOrphanages)

//user
routes.get( "/users", UsersController.listAll )

routes.get( "/:id([0-9]+)",[checkJwt, checkRole(["admin"])], UsersController.getOneById );

routes.post( "/users/create",[checkJwt, checkRole(["admin"])], UsersController.newUser );

routes.delete( "/:id([0-9]+)",[checkJwt, checkRole(["admin"])], UsersController.deleteUser );

export default routes