
/////////////////////////////////////////////////////////////////////
// DEVELOPMENT configuration
//
/////////////////////////////////////////////////////////////////////

const config = {

  client: {
    // this the public host name of your server for the
    // client socket to connect.
    // eg. https://myforgeapp.mydomain.com
    host: 'https://bim360-visual-report.herokuapp.com/',
    env: 'production',
    port: 443
  },

  forge: {

    oauth: {

      redirectUri: process.env.FORGE_CALLBACK_URL,
      authenticationUri: '/authentication/v1/authenticate',
      refreshTokenUri: '/authentication/v1/refreshtoken',
      authorizationUri: '/authentication/v1/authorize',
      accessTokenUri: '/authentication/v1/gettoken',

      baseUri: 'https://developer.api.autodesk.com',
      clientSecret: process.env.FORGE_CLIENT_SECRET,
      clientId: process.env.FORGE_CLIENT_ID,

      scope: [
        'data:read',
        'data:create',
        'data:write',
        'bucket:read',
        'bucket:create',
        'account:read'
      ]
    },

    viewer: {
      viewer3D: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js?v=2.15',
      threeJS:  'https://developer.api.autodesk.com/viewingservice/v1/viewers/three.min.js?v=2.15',
      style:    'https://developer.api.autodesk.com/viewingservice/v1/viewers/style.min.css?v=2.15'
    }
  }
}

module.exports = config


