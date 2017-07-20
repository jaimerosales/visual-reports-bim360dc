import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';
import React from 'react'
import ServiceManager from 'SvcManager'

export default class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      }

    this.treeSvc = ServiceManager.getService('TreeSvc')
    console.log('inside of Tree Client', this.treeSvc)

  }

  handleClick() {
    
  }

  handleChange(e, data) {
    this.setState({
      selected: data.selected,
    })
  }

  componentDidMount() {
    //const haveBIM360Hub = false;

     $('#autodeskTree').jstree({
      'core': {
        'themes': {"icons": true},
        'multiple': false,
        'data': {
          "url": this.treeSvc.api.apiUrl,
          "dataType": "json",
          'multiple': true,
          'data': function (node) {
            $('#autodeskTree').jstree(true).toggle_node(node);
            return {"id": node.id};
          }
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
      "state": {"key": "autodeskTree"}
    });
  }

  render() {
  

    return (
      <div id="autodeskTree" >
       
      </div>
    );
  }
}
