export default ({ env }) => ({
  // ...

  email: {
    config: {
      provider: 'strapi-provider-email-smtp',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'), //SMTP Host
        port: 25, //SMTP Port
        secure: false,
        auth: undefined

      },
    },
    settings: {
      defaultFrom: 'no-reply@horizon-sailing.fr',
      defaultReplyTo: 'horizon.sailing.fr@gmail.com',
    },
  },

  // ...
});
