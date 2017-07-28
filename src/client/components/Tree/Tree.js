import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';
import React from 'react'
import ServiceManager from 'SvcManager'

export default class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  handleClick() {

  }

  handleChange(e, data) {
    this.setState({
      selected: data.selected,
    })
  }

  componentDidMount() {
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
    }).on('loaded.jstree', function() {

    }).bind("activate_node.jstree", function(evt, data) {
      if (data != null && data.node != null && data.node.type == 'versions') {
        alert('Working on this implementation - be patient')
        console.log('data node',data)
        if (data.node.id === 'not_available') {
          alert('No viewable available for this version');
          return;
        }
        // var parent_node = $('#autodeskTree').jstree(true).get_node(data.node.parent);
        // loadDocument(data.node.id, parent_node.text);
      }
    });
  }

  render() {


    return (

      < div id = "autodeskTree" >
      < /div > 

    );
  }
}