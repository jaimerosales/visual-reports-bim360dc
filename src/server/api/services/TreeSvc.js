import ServiceManager from './SvcManager'
import BaseSvc from './BaseSvc'

export default class TreeSvc extends BaseSvc {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor (config) {
    super (config)
  }


  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  name() {

    return 'TreeSvc'
  }

  /////////////////////////////////////////////////////////////////
  // Returns Hubs
  //
  /////////////////////////////////////////////////////////////////
  

  getHubs(token) {

    return new Promise(async(resolve, reject) => {
    try {

      const dmSvc = ServiceManager.getService('DMSvc')

      const response = await dmSvc.getHubs(token)

      var hubsForTree = [];
      
      response.body.data.forEach(function (hub) {

        var hubType

        switch (hub.attributes.extension.type) {
          case "hubs:autodesk.core:Hub":
            hubType = "hubs";
            break;
          case "hubs:autodesk.a360:PersonalHub":
            hubType = "personalHub";
            break;
          case "hubs:autodesk.bim360:Account":
            hubType = "bim360Hubs";
            break;
        }

        hubsForTree.push(prepareItemForTree(
          hub.links.self.href,
          hub.attributes.name,
          hubType,
          true
        ));
      });

      res.json(hubsForTree);


    } catch (ex) {

      console.log(ex)

      res.status(ex.status || 500)
      res.json(ex)
    }
  })
}

getProjects(hubId, token) {

  return new Promise(async(resolve, reject) => {
  
  try {


      const dmSvc = ServiceManager.getService('DMSvc')

      const response = await dmSvc.getProjects(token, hubId)

      var projectsForTree = [];

      response.body.data.forEach(function (project) {

        var projectType = 'projects';

        switch (project.attributes.extension.type) {

          case 'projects:autodesk.core:Project':
            projectType = 'a360projects';
            break;
          case 'projects:autodesk.bim360:Project':
            projectType = 'bim360projects';
            break;
        }

        projectsForTree.push(prepareItemForTree(
          project.links.self.href,
          project.attributes.name,
          projectType,
          true
        ));


      res.json(projectsForTree)

    })
    }catch (ex) {

      console.log(ex)

      res.status(ex.status || 500)
      res.json(ex)
    }
  })
}

getProjectTopFolders (hubId, projectId, token) {

  return new Promise(async(resolve, reject) => {
  
  try {

      const dmSvc = ServiceManager.getService('DMSvc')

      const response = await dmSvc.getProjectTopFolders(
      token, hubId, projectId)

      const folderItemsForTree = [];

      response.body.data.forEach(function (item) {
        folderItemsForTree.push(prepareItemForTree(
          item.links.self.href,
          item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
          item.type,
          true
        ))

      })

      res.json(folderItemsForTree);
    }
  
    catch (ex) {

      console.log(ex)

      res.status(ex.status || 500)
      res.json(ex)
    }
  })
}

getFolderContents(projectId, folderId, token) {

  return new Promise(async(resolve, reject) => {

  try {

      const dmSvc = ServiceManager.getService('DMSvc')

      const response = await dmSvc.getFolderContent(
        token, projectId, folderId)

      const folderItemsForTree = [];

      response.body.data.forEach(function (item) {
        folderItemsForTree.push(prepareItemForTree(
          item.links.self.href,
          item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
          item.type,
          true
        ))
      })

      res.json(folderItemsForTree)

    } catch (ex) {

      res.status(ex.status || 500)
      res.json(ex)
    }
  })

}


getVersions(projectId, itemId, token) {

  return new Promise(async(resolve, reject) => {

  try {

      const dmSvc = ServiceManager.getService('DMSvc')

      const response = await dmSvc.getItemVersions(
        token, projectId, itemId)

      const versionsForTree = [];

      response.body.data.forEach(function (version) {
        var moment = require('moment');
        var lastModifiedTime = moment(version.attributes.lastModifiedTime);
        var days = moment().diff(lastModifiedTime, 'days')
        var dateFormated = (versions.body.data.length > 1 || days > 7 ? lastModifiedTime.format('MMM D, YYYY, h:mm a') : lastModifiedTime.fromNow());
        versionsForTree.push(prepareItemForTree(
          version.links.self.href,
          dateFormated + ' by ' + version.attributes.lastModifiedUserName,
          'versions',
          false
        ));
      })
      res.json(versionsForTree);

    } catch (ex) {

      res.status(ex.status || 500)
      res.json(ex)
    }

  })

}


prepareItemForTree(_id, _text, _type, _children) {
  return {id: _id, text: _text, type: _type, children: _children};
}

}