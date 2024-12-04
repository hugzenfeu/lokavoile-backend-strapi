/**
 * contact controller
 */
import { factories } from '@strapi/strapi';
import fs from 'fs/promises';
import Handlebars from 'handlebars';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({

  async create(ctx) {
    const response = await super.create(ctx);
    const { data } = response;

    // Préparation des données à injecter dans le template
    const templateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message
    };

    // Lecture et compilation des templates texte et HTML
    const textTemplate = await fs.readFile('./template/email/contact/email-template.txt', 'utf8');
    const htmlTemplate = await fs.readFile('./template/email/contact/email-template.html', 'utf8');

    const compiledText = Handlebars.compile(textTemplate)(templateData);
    const compiledHtml = Handlebars.compile(htmlTemplate)(templateData);

    // Envoi de l'email
    await strapi.plugins['email'].services.email.send({
      to: 'casanave.hugo@gmail.com',
      from: 'hugzenfeu@horizon-sailing.fr',
      subject: 'Nouvelle demande de réservation',
      text: compiledText,
      html: compiledHtml,
    });

    return response;
  }

}));
