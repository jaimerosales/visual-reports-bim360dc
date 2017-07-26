import ServiceManager from '../services/SvcManager'
import { serverConfig as config } from 'c0nfig'
import express from 'express'

module.exports = function() {

var router = express.Router()



router.get('/api/forge/tree', async (req, res) => {
  
	try {

		const forgeSvc = ServiceManager.getService('ForgeSvc');

    const token = await forgeSvc.get3LeggedTokenMaster(req.session)

    console.log('Token', token)

    const treeSvc = ServiceManager.getService('TreeSvc')

    console.log('TreeSvc value', treeSvc)

    const href = decodeURIComponent(req.query.id);
  
  	if (href === '') {
		  res.status(500).end();
    	return;
    }

  	if (href === '#') {    	
      treeSvc.getTreeHubs(token);
  	}

   	else {
    
  		const params = href.split('/');
    
   		const resourceName = params[params.length - 2];
    
  		const resourceId = params[params.length - 1];
    
  		switch (resourceName) {
        case 'hubs':
        	treeSvc.getTreeProjects(resourceId, token);
        	break;
      	case 'projects':
    		// for a project, first we need the top/root folder
        	var hubId = params[params.length - 3];
        	treeSvc.getTreeProjectTopFolders(hubId, resourceId/*project_id*/, token)
        	break;
      	case 'folders':
        	var projectId = params[params.length - 3];
        	treeSvc.getTreeFolderContents(projectId, resourceId/*folder_id*/, token);
        	break;
      	case 'items':
        	var projectId = params[params.length - 3];
        	treeSvc.getTreeVersions(projectId, resourceId/*item_id*/, token);
        	break;
    	}

		} 

	}
	catch (ex) {

      console.log(ex)

      res.status(ex.status || 500)
      res.json(ex)
  	}

})

 return router

}


/// Moved this to TreeSvc.js in the Server/Services Folder

// function getHubs(token, res) {

// 	try {

//       const dmSvc = ServiceManager.getService('DMSvc')

//       const response = await dmSvc.getHubs(token)

//       const hubsForTree = [];
      
//       response.body.data.forEach(function (hub) {

//         const hubType;

//         switch (hub.attributes.extension.type) {
//           case "hubs:autodesk.core:Hub":
//             hubType = "hubs";
//             break;
//           case "hubs:autodesk.a360:PersonalHub":
//             hubType = "personalHub";
//             break;
//           case "hubs:autodesk.bim360:Account":
//             hubType = "bim360Hubs";
//             break;
//         }

//         hubsForTree.push(prepareItemForTree(
//           hub.links.self.href,
//           hub.attributes.name,
//           hubType,
//           true
//         ));
//       });

//       res.json(hubsForTree);


//     } catch (ex) {

//       console.log(ex)

//       res.status(ex.status || 500)
//       res.json(ex)
//     }

// }

// function getProjects(hubId, token, res) {
  
// 	try {


//       const dmSvc = ServiceManager.getService('DMSvc')

//       const response = await dmSvc.getProjects(token, hubId)

//       var projectsForTree = [];

//       response.body.data.forEach(function (project) {

//         var projectType = 'projects';

//         switch (project.attributes.extension.type) {

//           case 'projects:autodesk.core:Project':
//             projectType = 'a360projects';
//             break;
//           case 'projects:autodesk.bim360:Project':
//             projectType = 'bim360projects';
//             break;
//         }

//         projectsForTree.push(prepareItemForTree(
//           project.links.self.href,
//           project.attributes.name,
//           projectType,
//           true
//         ));


//       res.json(projectsForTree)

//     })
//   	}catch (ex) {

//       console.log(ex)

//       res.status(ex.status || 500)
//       res.json(ex)
//     }
// }

// function getProjectTopFolders(hubId, projectId, token, res) {
// 	try {

//       const dmSvc = ServiceManager.getService('DMSvc')

//       const response = await dmSvc.getProjectTopFolders(
//       token, hubId, projectId)

//       const folderItemsForTree = [];

//       response.body.data.forEach(function (item) {
//         folderItemsForTree.push(prepareItemForTree(
//           item.links.self.href,
//           item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
//           item.type,
//           true
//         ))

//       res.json(folderItemsForTree);

//       })
//     }
  
//     catch (ex) {

//       console.log(ex)

//       res.status(ex.status || 500)
//       res.json(ex)
//     }
// }


// function getFolderContents(projectId, folderId, token, res) {

// 	try {

//       const dmSvc = ServiceManager.getService('DMSvc')

//       const response = await dmSvc.getFolderContent(
//         token, projectId, folderId)

//       const folderItemsForTree = [];

//       response.body.data.forEach(function (item) {
//         folderItemsForTree.push(prepareItemForTree(
//           item.links.self.href,
//           item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
//           item.type,
//           true
//         ))
//       })

//       res.json(folderItemsForTree)

//     } catch (ex) {

//       res.status(ex.status || 500)
//       res.json(ex)
//     }

// }

// function getVersions(projectId, itemId, token, res) {

// 	try {

//       const dmSvc = ServiceManager.getService('DMSvc')

//       const response = await dmSvc.getItemVersions(
//         token, projectId, itemId)

//       const versionsForTree = [];

//       response.body.data.forEach(function (version) {
//         var moment = require('moment');
//         var lastModifiedTime = moment(version.attributes.lastModifiedTime);
//         var days = moment().diff(lastModifiedTime, 'days')
//         var dateFormated = (versions.body.data.length > 1 || days > 7 ? lastModifiedTime.format('MMM D, YYYY, h:mm a') : lastModifiedTime.fromNow());
//         versionsForTree.push(prepareItemForTree(
//           version.links.self.href,
//           dateFormated + ' by ' + version.attributes.lastModifiedUserName,
//           'versions',
//           false
//         ));
//     	})
//       res.json(versionsForTree);

//     } catch (ex) {

//       res.status(ex.status || 500)
//       res.json(ex)
//     }

// }


// function prepareItemForTree(_id, _text, _type, _children) {
//   return {id: _id, text: _text, type: _type, children: _children};
// }

