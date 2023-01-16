import nodemailer from "nodemailer";
import { google } from 'googleapis'
import dotenv from 'dotenv';

dotenv.config();

class MailService {
  constructor() {
    const clientId = process.env.OAUTH2_CLIENT_ID;
    const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
    const redirectUri = process.env.OAUTH2_REDIRECT_URI;
    const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;

   

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oAuth2Client.setCredentials({refresh_token: process.env.OAUTH2_REFRESH_TOKEN});
    this.oAuth2Client = oAuth2Client;
    
  }

  async sendActivationMail(to, link) {
    await this.oAuth2Client.setCredentials({refresh_token: process.env.OAUTH2_REFRESH_TOKEN});
    const accessToken = await this.oAuth2Client.getAccessToken();

      // host: process.env.SMTP_HOST,
      // port:process.env.SMTP_PORT,
      // secure: true,

      // pass: process.env.SMTP_PASSWORD


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
        accessToken: accessToken,
      }
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation. ${process.env.API_URL}`,
      text: '',
      html:
      `
        <div>
          <h1>Activation link</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    })
  }
}
export default new MailService();
// 724804446747-8chdeve9lusr9r4b9h1hvistvriqgn85.apps.googleusercontent.com
// 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