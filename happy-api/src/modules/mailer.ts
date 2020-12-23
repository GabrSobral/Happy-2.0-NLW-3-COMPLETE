const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
import path from 'path'

import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const { host, port } = require('../config/mail.json')


export default async function sendEmail(username : string, token : string ){

  console.log("logando")
  const myOAuth2Client = new OAuth2(
    "638907025521-ia3njhdh62k9filk6o03e5mc6pqrhsu3.apps.googleusercontent.com",
    "_jyBqhklDeYcoxtz8uzf1UfV",
    "https://developers.google.com/oauthplayground"
    )
  
    console.log("setando token")
    myOAuth2Client.setCredentials({
      refresh_token:"1//04bG2tsBkHcsYCgYIARAAGAQSNwF-L9IrSlvUb4oCAfiWGOtYiHrKnwBu3R_MAA7sZi-Ah0Yf1B2ZvqjU6CLhQ5GXNJar2cnRm40"
      });

      console.log("pegando token")

      const myAccessToken = await myOAuth2Client.getAccessToken()

  try{
    console.log("criando")

    const transport = nodemailer.createTransport({
      host,
      port,
      auth: { 
            type: "OAuth2",
            service : "gmail",
            secure: true,
            user: "Happy.Orphanages.Project@gmail.com",     
            clientId: "638907025521-ia3njhdh62k9filk6o03e5mc6pqrhsu3.apps.googleusercontent.com",
            clientSecret: "_jyBqhklDeYcoxtz8uzf1UfV",
            refreshToken: "1//04bG2tsBkHcsYCgYIARAAGAQSNwF-L9IrSlvUb4oCAfiWGOtYiHrKnwBu3R_MAA7sZi-Ah0Yf1B2ZvqjU6CLhQ5GXNJar2cnRm40",
            accessToken: myAccessToken,
          } 
             
    });

    console.log("compilando")
  
    transport.use('compile', hbs({
      viewEngine: {
          defaultLayout: undefined,
          partialsDir: path.resolve('./src/resources/mail/')
        },
        viewPath: path.resolve('./src/resources/mail/'),
        extName: '.html',
    }))

    transport.close()

    console.log("enviando")

      await transport.sendMail({
        to: username,
        from: 'Happy <Happy.Orphanages.Project@gmail.com>',
        template :'auth/forgotPassword',
        subject: "Recuperação de senha",
        context: { token, username } 
      }, (err : any) => {
        return err
      })

      console.log("Enviado")

      console.log(transport)

  } catch(err){
    return err
  }
}



