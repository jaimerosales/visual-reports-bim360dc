
## Running the sample

Configuration is controlled by **NODE_ENV**
[environment variable](https://www.google.com/webhp?q=set+environment+variable&gws_rd=cr&ei=tum2WMaSF4SdsgHruLrIDg),
make sure to set it properly to **development** or **production**,
based on the configuration type you want to run.

## Development Setup

In **development**, the client is dynamically built by the
[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware), so just run:

 * `npm install`    *(downloads project dependencies locally)*

 * `cp forge_auth.sh.example forge_auth_dev.sh`   

Setup your development Keys in the sh file. 

 * development:

    `FORGE_DEV_CLIENT_ID`

    `FORGE_DEV_CLIENT_SECRET`
    
    `NODE_ENV` = developemnt
    
    `PORT` = 3000
    
 
 * `source forge_auth_dev.sh `      *(assigns values to ENV Variables)*

 * `npm start`      *(builds client on the fly and run server)*

 * open [http://localhost:3000](http://localhost:3000) in your favorite browser


## Production Setup

In **production**, the client requires a build step, so run:

 * `npm install` *(not required if you already run at previous step)*

 * `cp forge_auth.sh.example forge_auth_prod.sh`   

Setup your development Keys in the sh file. 

 * development:

    `FORGE_CLIENT_ID`

    `FORGE_CLIENT_SECRET`
    
    `NODE_ENV` = production


 * `npm run build-prod && npm start` *(builds client and run server)*

 * open [http://localhost:3000](http://localhost:3000) in your favorite browser


## Config Setup

Using the same Forge ClientId & ClientSecret used to upload the model,
populate environment variables used by the config files (in **/config**):

  * development:

    `FORGE_DEV_CLIENT_ID`

    `FORGE_DEV_CLIENT_SECRET`

  * production:

    `FORGE_CLIENT_ID`

    `FORGE_CLIENT_SECRET`


Restart the server, you can then directly load your model by specifying design **URN** as query parameter in the url of the viewer page:

[http://localhost:3000/viewer?urn=YOUR_URN_HERE](http://localhost:3000/viewer?urn=YOUR_DESIGN_URN_HERE)


## Deploy to Heroku

Use your **Forge ClientId & ClientSecret** obtained while
[Creating a new Forge App](https://developer.autodesk.com/myapps/create)

And Press Deploy button below:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Wait for a while once the Heroku App has been deployed as the client needs to be built **after the first run**
