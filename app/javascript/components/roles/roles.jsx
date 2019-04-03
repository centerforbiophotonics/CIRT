import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { CSVLink } from 'react-csv';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport, faBroom } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport, faBroom )

import Role from './role';
import RoleForm from './role_form';
import RoleMerger from './role_merger';

/**
 * User interface for listing, filtering and exporting Roles. Renders subcomponents for CRUD actions. Can be used a root component or rendered from the form or show component of an associated model. 
 */
class Roles extends React.Component {
  static propTypes = {
    /** @type {object} A hash of role ids to objects containing their attributes and associated models' attributes. */
    roles: PropTypes.object,
    /** @type {object} The user who requested the page. The users roles array can be used for authorization. */
    current_user: PropTypes.object,
    /** @type {function} If this component is used by another to display its associations it can provide a handler which this component will call to update the parent state after it has changed. */
    handleUpdate: PropTypes.func,
    /** @type {string} The parent model name to be used if this component is nested within another to hide fields set by the parent (id fields). */
    parent_model: PropTypes.string,
    /** @type {object} The parent object these records belong to. */
    parent: PropTypes.object,
    /** @type {number} Passed to ReactTable to set the initial number of rows per page. */
    defaultPageSize: PropTypes.number
  };

  static defaultProps = {
    defaultPageSize: 100
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.toggleMerging = this.toggleMerging.bind(this); 
    this.toggleAdd = this.toggleAdd.bind(this);
    this.add = this.add.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.update = this.update.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.delete = this.delete.bind(this);
    this.columnDefs = this.columnDefs.bind(this);
    this.backToTop = this.backToTop.bind(this);
    this.copy = this.copy.bind(this);
    this.setExport = this.setExport.bind(this);

    this.state = {
      /** @type {Object} A hash of the records to display */
      roles: this.copy(props.roles),
      /** @type {Boolean} Whether the create menu is visible */
      adding: false,
      /** @type {Boolean} Whether the show view is visible */
      showing: false,
      /** @type {Boolean} Whether the edit menu is visible */
      editing: false,
      /** @type {Boolean} Whether the merge menu is visible */
      merging: false,
      /** @type {Boolean} The record currently being displayed in either the show, add, or edit component. */
      selected: null,
      /** @type {Array} The data that has been sorted and filtered by react table for export via CSVLink */
      export_data: [],
      /** @type {String} A message that will be shown to the user. */
      status_message: "",
      /** @type {String} The type of. Uses bootstrap alert types. */
      status_message_type: "info"
    };
  }

  /** 
   * Click handler that toggles the add menu and hides the show and edit components. 
   * @public
   */
  toggleMerging(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();
    
    this.setState(prevState => ({
      merging: !prevState.merging,
      adding: false,
      editing: false,
      showing: false
    }));

    this.backToTop();
  }

  merge

  /** 
   * Click handler that toggles the add menu and hides the show and edit components. 
   * @public
   */
  toggleAdd(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();
    
    this.setState(prevState => ({
      merging: false,
      adding: !prevState.adding,
      editing: false,
      showing: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after a form succeeds in adding a new model instance to update the client state. 
   * @param {object} role - The model instance to add to the current state.
   * @public
   */
  add(role) {
    this.setState(function(prevState, props){
      prevState.roles[role.id] = role;
      prevState.adding = false;

      prevState.editing = true;
      prevState.selected = role;

      prevState.status_message = "role"+role.id+" created.";
      prevState.status_message_type = "success";
      return prevState;
    });
  }

  /** 
   * Click handler that toggles the edit menu and hides the show and add components. 
   * @public
   */
  toggleUpdate(e,d){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();

    this.setState(prevState => ({
      merging: false,
      selected: (d === undefined ? null : d.original),
      editing: !prevState.editing,
      showing: false,
      adding: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after a form succeeds in editing a model instance to update the client state. 
   * @param {object} role - The updated model instance replace in the current state.
   * @public
   */
  update(role){
    this.setState(function(prevState, props){
      prevState.roles[role.id] = role;
 
      prevState.status_message = "role"+role.id+" updated.";
      prevState.status_message_type = "success";

      return prevState;
    });
  }

  /** 
   * Click handler that toggles the show component and hides the edit and add components. 
   * @public
   */
  toggleShow(e,d){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();

    this.setState(prevState => ({
      selected: (d === undefined ? null : d.original),
      showing: !prevState.showing,
      editing: false,
      adding: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after a form succeeds in deleting a model instance to update the client state. 
   * @param {object} role - The deleted model instance remove from the current state.
   * @public
   */
  delete(role){
    this.setState(function(prevState, props){
      delete prevState.roles[role.id];
      prevState.selected = null;
      prevState.editing = false;

      prevState.status_message = "role"+role.id+" deleted.";
      prevState.status_message_type = "success";

      return prevState;
    });
  }

  /**
   * An organizing function that returns the column definition options use by react table.
   * @return {object} Options to be passed to react table @link https://react-table.js.org/#/story/readme
   * @public
   */
  columnDefs(){
    return [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Children / Variants', accessor: 'children', 
        Cell: d => {
          if (d.value == undefined){
            return null
          } else {
            return (
              d.value.map(r => (r.name)).join(", ")
            )
          }
          
        } 
      },
      { 
        Header: 'Actions',
        Cell: d => {
          return (
            <div>
              <a className="btn btn-sm btn-secondary text-white" onClick={(e)=>{this.toggleShow(e,d)}}><FontAwesomeIcon icon="eye"/></a>
              <a className="btn btn-sm btn-secondary text-white ml-1" onClick={(e)=>{this.toggleUpdate(e,d)}}><FontAwesomeIcon icon="pen"/></a>
            </div>
          )
        },
        className: "text-center",
        sortable: false,
        resizable: false,
        filterable: false,
        width: 80
      }
    ];
  }

  /** 
   * Scrolls the window to the top of the page. 
   * @public
   */
  backToTop(e){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  /**
   * Copies an object to avoid reference errors
   * @public
   */
  copy(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Sets a state attribute that contains the data as filtered and sorted by react table and is used by CSVLink to download a CSV export.
   * @public
   */
  setExport(){
    if (this.reactTable)
      this.setState({export_data: this.reactTable.getResolvedState().sortedData.map((r)=> r._original)});
  }
     
  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let top_content = <div className="float-left">
      <a className="btn btn-secondary text-white mb-3" onClick={this.toggleAdd}>
        <FontAwesomeIcon icon="plus"/>
      </a>
      <a 
        className="btn btn-secondary text-white mb-3 ml-1" 
        onClick={this.toggleMerging}
        title="Consolidate Roles"
      >
        <FontAwesomeIcon icon="broom"/>
      </a>
    </div>;
    
    if (this.state.adding){
      top_content = <RoleForm 
        action="create" 
        current_user={this.props.current_user}
        parent_model={this.props.parent_model}
        handleNew={this.add}
        handleFormToggle={this.toggleAdd}
      />
    } else if (this.state.editing){
      top_content = <RoleForm 
        action="update" 
        role={this.state.selected} 
        current_user={this.props.current_user}
        parent_model={this.props.parent_model}
        handleUpdate={this.update} 
        handleDelete={this.delete}
        handleFormToggle={this.toggleUpdate}
      />
    } else if (this.state.showing){
      top_content = <Role 
        role={this.state.selected}
        current_user={this.props.current_user}
        close={this.toggleShow}
      />
    } else if (this.state.merging){
      top_content = <RoleMerger 
        roles={this.state.roles}
        close={this.toggleMerging}
        update={this.update}
      />
    }

    return (
      <div className="roles col-md-12">
        <a className="btn btn-secondary text-white btn-sm" id="back-to-top" onClick={this.backToTop}><FontAwesomeIcon icon="arrow-up"/></a> 
        <div className="card">
          <h2 className="card-title text-center">
            Roles     
          </h2>

          {this.state.status_message != "" &&

            <div className={"alert alert-"+this.state.status_message_type+" alert-dismissible mx-5"} role={this.state.status_message_type}>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h3>{this.state.status_message}</h3>
            </div>
          }

          <div className="card-body">
            {top_content}

            <CSVLink 
              data={this.state.export_data} 
              className="btn btn-secondary text-white mb-3 ml-1"
              filename="roles_export.csv"
            >
              <FontAwesomeIcon icon="file-export"/>
            </CSVLink>

            <ReactTable
              data={Object.values(this.state.roles)}
              columns={this.columnDefs()}
              filterable
              defaultPageSize={this.props.defaultPageSize}
              ref={(r)=>this.reactTable=r}
              onSortedChange={this.setExport}
              onFilteredChange={this.setExport}
            />
          </div>
        </div>
      </div>
    );
  }

  /** 
   * The componentDidMount lifecycle method. Registers an window scroll listener that shows/hides the back-to-top button 
   * @public
   */
  componentDidMount(){  
    var buttonScrollThreshold = 177;
    
    window.onscroll = function() {
      if (document.body.scrollTop > buttonScrollThreshold || document.documentElement.scrollTop > buttonScrollThreshold) {
        document.getElementById("back-to-top").style.display = "block";
      } else {
        document.getElementById("back-to-top").style.display = "none";
      }
    }

    this.setExport();
  }

  /**
   * The componentWillReceiveProps lifecycle method. 
   * Because the records stored in the state are initially set from a prop, 
   * if the prop is updated this ensures the state is updated as well. 
   * This will happen when this component is not the root, 
   * but is rendered by another component to display its associated model attributes. 
   * @public
   */
  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      prevState.roles = this.copy(nextProps.roles);
      return prevState;
    })
  }
}

export default Roles;