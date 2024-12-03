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
            subject: 'Use strapi email provider successfully',
            text: `Hello,\n\nHere is the data:${dataString}\n\n`,
            html: `<p>Hello,</p><p>Here is the data:${dataString}</p><pre></pre>`,
        });

        return response
    }

})
);

