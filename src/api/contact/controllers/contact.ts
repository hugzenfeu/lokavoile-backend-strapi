/**
 * contact controller
 */

import { factories } from '@strapi/strapi'


export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({

    async create(ctx) {


        const response = await super.create(ctx);
        const { data } = response

        // Create a string representation of the data object (you can customize this formatting)
        const dataString = JSON.stringify(data, null, 2); // Format it nicely with 2 spaces indentation

        // Send the email with the data included
        await strapi.plugins['email'].services.email.send({
            to: 'casanave.hugo@gmail.com',
            from: 'hugzenfeu@horizon-sailing.fr',
            subject: 'Nouvelle demande de reservation ',
            text: `Bonjour Pierre,  \n\n

M. ${data.firstName} ${data.lastName} souhaite réserver un bateau.  \n
Voici ses coordonnées :  \n
- Email : ${data.email}  \n
- Téléphone : ${data.phoneNumber}  \n

Son message est le suivant : \n 
"${data.message}"
`,
            html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #444;
    }
    p {
      margin: 10px 0;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    blockquote {
      background-color: #f9f9f9;
      border-left: 4px solid #ccc;
      margin: 10px 0;
      padding: 10px 20px;
      font-style: italic;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Bonjour Pierre,</p>

    <p><strong>M. ${data.firstName} ${data.lastName}</strong> souhaite réserver un bateau.</p>

    <p><strong>Voici ses coordonnées :</strong></p>
    <ul>
      <li>Email : <a href="mailto:${data.email}">${data.email}</a></li>
      <li>Téléphone : <a href="tel:${data.phoneNumber}">${data.phoneNumber}</a></li>
    </ul>

    <p><strong>Son message :</strong></p>
    <blockquote>${data.message}</blockquote>
  </div>
</body>
</html>

`,
        });

        return response
    }

})
);

