

export default [
  // { //marche pas 
  //   name: 'global::setCacheControl',
  //   config: {
  //     maxage: 31536000, // Cache for one year
  //   },
  // },
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: 'Horizon sailing <horizon-sailing.fr>'
    },
  },
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',

  {
    name: 'strapi::public',
    config: {
      path: './public',
      maxage: 315360, // Cache for one year
      immutable: true,
    },
  },


];
