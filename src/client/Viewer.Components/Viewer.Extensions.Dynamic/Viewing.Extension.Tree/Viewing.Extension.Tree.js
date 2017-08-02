import MultiModelExtensionBase from 'Viewer.MultiModelExtensionBase'
import ExtensionBase from 'Viewer.ExtensionBase'
import ContextMenuExtensionId from 'Viewing.Extension.ContextMenu'
import DualExtensionId from 'Viewing.Extension.DualViewer'
import Toolkit from 'Viewer.Toolkit'

import {
  ReactLoader as Loader
} from 'Loader'
import ServiceManager from 'SvcManager'
import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';
import React from 'react'


class TreeExtension extends MultiModelExtensionBase {

  constructor(viewer, options) {

    super(viewer, options)

    this.state = {
      dualExtension: null
    }

    this.render = this.render.bind(this)

    this.react = options.react

    this.viewer = viewer

    this.launchViewer = this.launchViewer.bind(this)
  }


  static get ExtensionId() {

    return 'Viewing.Extension.Tree'
  }

  load() {

    this.react.setState({
      activeProperty: '',
      showLoader: true,
      disabled: true,
      items: [],
      data: []
    }).then(() => {

      this.react.pushRenderExtension(this)

      const model = this.viewer.activeModel ||
        this.viewer.model

      if (model) {

        this.loadTree(this.viewer)
      }

    })


    console.log('Viewing.Extension.Tree loaded')

    return true
  }


  unload() {

    console.log('Viewing.Extension.Tree unloaded')

    super.unload()

    return true
  }


  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onModelActivated(event) {

    if (event.source !== 'model.loaded') {

      this.loadTree(event.model)
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onGeometryLoaded(event) {

    this.loadTree(event.target)
  }

  loadTree(viewer) {

    var haveBIM360Hub = false;

    $('#autodeskTree').jstree({
        'core': {
          'themes': {
            "icons": true
          },
          'multiple': false,
          'data': {
            "url": "api/tree",
            "dataType": "json",
            'multiple': true,
            'data': function(node) {
              $('#autodeskTree').jstree(true).toggle_node(node);
              return {
                "id": node.id
              };
            },
            "success": function(nodes) {
              nodes.forEach(function(n) {
                if (n.type === 'bim360Hubs' && n.id.indexOf('b.') > 0)
                  haveBIM360Hub = true;
              })
            },
          }
        },
        'types': {
          'default': {
            'icon': 'glyphicon glyphicon-question-sign'
          },
          '#': {
            'icon': 'glyphicon glyphicon-user'
          },
          'hubs': {
            'icon': '/resources//img/a360hub.png'
          },
          'personalHub': {
            'icon': '/resources//img/a360hub.png'
          },
          'bim360Hubs': {
            'icon': '/resources//img/bim360hub.png'
          },
          'bim360projects': {
            'icon': '/resources//img/bim360project.png'
          },
          'a360projects': {
            'icon': '/resources//img/a360project.png'
          },
          'items': {
            'icon': 'glyphicon glyphicon-file'
          },
          'folders': {
            'icon': 'glyphicon glyphicon-folder-open'
          },
          'versions': {
            'icon': 'glyphicon glyphicon-time'
          }
        },
        "plugins": ["types", "state", "sort"],
        "state": {
          "key": "autodeskTree"
        }
      })
      .bind("activate_node.jstree", (evt, data) => {
        if (data != null && data.node != null && data.node.type == 'versions') {

          if (data.node.id === 'not_available') {

            alert('No viewable available for this version');

            return;

          }

          this.launchViewer(data.node.id, viewer)

        }
      })
  }


  async launchViewer(urn, viewer) {


    var doc = await this.loadDocument(urn)

    var path = this.getViewablePath(doc)

    var dualExt = viewer.getExtension("Viewing.Extension.DualViewer");

    // Function to get DualViewer to load new Document. 

    viewer.impl.unloadCurrentModel()

    viewer.loadModel(path)

  }


  /////////////////////////////////////////////////////////
  // Load a document from URN
  //
  /////////////////////////////////////////////////////////
  loadDocument(urn) {

    return new Promise((resolve, reject) => {

      const paramUrn = !urn.startsWith('urn:') ? 'urn:' + urn : urn

      Autodesk.Viewing.Document.load(paramUrn, (doc) => {

        resolve(doc)

      }, (error) => {

        reject(error)
      })
    })
  }

  /////////////////////////////////////////////////////////
  // Return viewable path: first 3d or 2d item by default
  //
  /////////////////////////////////////////////////////////
  getViewablePath(doc, pathIdx = 0, roles = ['3d', '2d']) {

    const rootItem = doc.getRootItem()

    const roleArray = [...roles]

    let items = []

    roleArray.forEach((role) => {

      items = [...items,
        ...Autodesk.Viewing.Document.getSubItemsWithProperties(
          rootItem, {
            type: 'geometry',
            role
          }, true)
      ]
    })

    if (!items.length || pathIdx > items.length) {

      return null
    }

    return doc.getViewablePath(items[pathIdx])
  }

  render() {


    return (

      < div id = "autodeskTree" >
      < /div > 

    )
  }
}


Autodesk.Viewing.theExtensionManager.registerExtension(
  TreeExtension.ExtensionId,
  TreeExtension)