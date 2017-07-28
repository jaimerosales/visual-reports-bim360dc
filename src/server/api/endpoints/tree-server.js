import ServiceManager from '../services/SvcManager'
import {
  serverConfig as config
} from 'c0nfig'
import express from 'express'

module.exports = function() {

  var router = express.Router()

  router.get('/', async(req, res) => {

    try {

      const forgeSvc = ServiceManager.getService('ForgeSvc');

      const token = await forgeSvc.get3LeggedTokenMaster(req.session)

      const treeSvc = ServiceManager.getService('TreeSvc')

      const href = decodeURIComponent(req.query.id);

      if (href === '') {
        res.status(500).end();
        return;
      }

      if (href === '#') {

        treeSvc.getTreeHubs(token, res);
      
      } else {

        const params = href.split('/');

        const resourceName = params[params.length - 2];

        const resourceId = params[params.length - 1];

        switch (resourceName) {
          case 'hubs':
            treeSvc.getTreeProjects(resourceId, token, res);
            break;
          case 'projects':
            // for a project, first we need the top/root folder
            var hubId = params[params.length - 3];
            treeSvc.getTreeProjectTopFolders(hubId, resourceId /*project_id*/ , token, res)
            break;
          case 'folders':
            var projectId = params[params.length - 3];
            treeSvc.getTreeFolderContents(projectId, resourceId /*folder_id*/ , token, res);
            break;
          case 'items':
            var projectId = params[params.length - 3];
            treeSvc.getTreeVersions(projectId, resourceId /*item_id*/ , token, res);
            break;
        }

      }

    } catch (ex) {

      console.log(ex)

      res.status(ex.status || 500)
      res.json(ex)
    }

  })

  return router

}