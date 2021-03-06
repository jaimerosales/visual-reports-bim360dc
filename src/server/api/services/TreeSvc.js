import ServiceManager from './SvcManager'
import BaseSvc from './BaseSvc'
import Forge from 'forge-apis'
import moment from 'moment'

export default class TreeSvc extends BaseSvc {

  constructor(config) {
    super(config)

    this._projectsAPI = new Forge.ProjectsApi()
    this._versionsAPI = new Forge.VersionsApi()
    this._foldersAPI = new Forge.FoldersApi()
    this._itemsAPI = new Forge.ItemsApi()
    this._hubsAPI = new Forge.HubsApi()

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

  getTreeHubs(token, res) {

    return new Promise(async(resolve, reject) => {
      try {

        const response = await this._hubsAPI.getHubs({}, {
          autoRefresh: false
        }, token)

        var hubsForTree = [];

        response.body.data.forEach(function(hub) {

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

          hubsForTree.push({
            id: hub.links.self.href,
            text: hub.attributes.name,
            type: hubType,
            children: true
          });
        });

        res.json(hubsForTree);


      } catch (ex) {

        console.log(ex)

        res.status(ex.status || 500)
        res.json(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////////////
  // Returns Projects
  //
  /////////////////////////////////////////////////////////////////


  getTreeProjects(hubId, token, res) {

    return new Promise(async(resolve, reject) => {

      try {

        const response = await this._projectsAPI.getHubProjects(hubId, {}, {
          autoRefresh: false
        }, token)

        var projectsForTree = [];

        response.body.data.forEach(function(project) {

          var projectType = 'projects'

          switch (project.attributes.extension.type) {

            case 'projects:autodesk.core:Project':
              projectType = 'a360projects';
              break;
            case 'projects:autodesk.bim360:Project':
              projectType = 'bim360projects';
              break;
          }
          projectsForTree.push({
            id: project.links.self.href,
            text: project.attributes.name,
            type: projectType,
            children: true
          });

        })
        res.json(projectsForTree)

      } catch (ex) {

        console.log(ex)

        res.status(ex.status || 500)
        res.json(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////////////
  // Returns Project Top Folders
  //
  /////////////////////////////////////////////////////////////////


  getTreeProjectTopFolders(hubId, projectId, token, res) {

    return new Promise(async(resolve, reject) => {

      try {

        const response = await this._projectsAPI.getProjectTopFolders(
          hubId, projectId, {
            autoRefresh: false
          }, token)

        var folderItemsForTree = [];

        response.body.data.forEach(function(item) {
          folderItemsForTree.push({
            id: item.links.self.href,
            text: item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
            type: item.type,
            children: true
          })

        })

        res.json(folderItemsForTree);
      } catch (ex) {

        console.log(ex)

        res.status(ex.status || 500)
        res.json(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////////////
  // Returns Folder Content
  //
  /////////////////////////////////////////////////////////////////


  getTreeFolderContents(projectId, folderId, token, res) {

    return new Promise(async(resolve, reject) => {

      try {

        const response = await this._foldersAPI.getFolderContents(
          projectId, folderId, {}, {
            autoRefresh: false
          }, token)

        var folderItemsForTree = [];

        response.body.data.forEach(function(item) {
          var displayName = item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName;
          if (displayName !== '') { // BIM 360 Items with no displayName also don't have storage, so not file to transfer
            folderItemsForTree.push({
              id: item.links.self.href,
              text: item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
              type: item.type,
              children: true
            })
          }
        })

        res.json(folderItemsForTree)

      } catch (ex) {

        console.log(ex)
        res.status(ex.status || 500)
        res.json(ex)
      }
    })

  }

  /////////////////////////////////////////////////////////////////
  // Returns File versions
  //
  /////////////////////////////////////////////////////////////////

  getTreeVersions(projectId, itemId, token, res) {

    return new Promise(async(resolve, reject) => {

      try {

        const response = await this._itemsAPI.getItemVersions(
          projectId, itemId, {}, {
            autoRefresh: false
          }, token)

        var versionsForTree = [];

        response.body.data.forEach(function(version) {
          var lastModifiedTime = moment(version.attributes.lastModifiedTime);
          var days = moment().diff(lastModifiedTime, 'days')
          var fileType = version.attributes.fileType
          var dateFormated = (response.body.data.length > 1 || days > 7 ? lastModifiedTime.format('MMM D, YYYY, h:mm a') : lastModifiedTime.fromNow());
          var fileName = version.attributes.fileName;

          var designId = (version.relationships != null && version.relationships.derivatives != null ?
          version.relationships.derivatives.data.id : null);

          versionsForTree.push({
            id: designId,
            text: dateFormated + ' by ' + version.attributes.lastModifiedUserName,
            type: 'versions',
            children: false,
            fileType: fileType,
            fileName: fileName
          });

        })
        res.json(versionsForTree);

      } catch (ex) {
        console.log(ex)
        res.status(ex.status || 500)
        res.json(ex)
      }

    })

  }

}