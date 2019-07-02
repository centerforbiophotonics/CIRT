import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { CSVLink } from 'react-csv';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport )

import Group from './group';
import GroupForm from './group_form';

/**
 * User interface for listing, filtering and exporting Groups. Renders subcomponents for CRUD actions. Can be used a root component or rendered from the form or show component of an associated model.
 */
class Groups extends React.Component {
  static propTypes = {
    /** A hash of group ids to objects containing their attributes and associated models' attributes. */
    groups: PropTypes.object,
    /** An object with all attributes of the user who requested the page. The users roles array can be used for authorization. */
    current_user: PropTypes.object,
    handleUpdate: PropTypes.func
  }

  /**
   * The constructor lifecycle method.
   * @param {object} props - The component's props
   * @public
   */
  constructor(props){
    super(props);

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
      groups: this.copy(props.groups),
      /** @type {Boolean} Whether the create menu is visible */
      adding: false,
      /** @type {Boolean} Whether the show view is visible */
      showing: false,
      /** @type {Boolean} Whether the edit menu is visible */
      editing: false,
      /** @type {Boolean} The record currently being displayed in either the show, add, or edit component. */
      selected: null,
      /** @type {Array} The data that has been sorted and filtered by react table for export via CSVLink */
      export_data: []
    };
  }

  /**
   * Click handler that toggles the add menu and hides the show and edit components.
   * @public
   */
  toggleAdd(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();

    this.setState(prevState => ({
      adding: !prevState.adding,
      editing: false,
      showing: false
    }));

    this.backToTop();
  }

  /**
   * Handler invoked after a form succeeds in adding a new model instance to update the client state.
   * @param {object} group - The model instance to add to the current state.
   * @public
   */
  add(group) {
    this.setState(function(prevState, props){
      prevState.groups[group.id] = group;
      prevState.adding = false;
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
      selected: (d === undefined ? null : d.original),
      editing: !prevState.editing,
      showing: false,
      adding: false
    }));

    this.backToTop();
  }

  /**
   * Handler invoked after a form succeeds in editing a model instance to update the client state.
   * @param {object} group - The updated model instance replace in the current state.
   * @public
   */
  update(group){
    this.setState(function(prevState, props){
      prevState.groups[group.id] = group;
      prevState.selected = null;
      prevState.editing = false;
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
   * @param {object} group - The deleted model instance remove from the current state.
   * @public
   */
  delete(group){
    this.setState(function(prevState, props){
      delete prevState.groups[group.id];
      prevState.selected = null;
      prevState.editing = false;
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
      { Header: 'Description', accessor: 'description' },
      { Header: 'Group Category', accessor: d => d.group_category ? d.group_category.name : "Uncategorized", id: 'groupCategoryName' },
      { Header: 'Parent Group', accessor: d => d.parent ? d.parent.name : "", id: 'parentName' },
      { Header: 'People',
        accessor: 'person_groups',
        maxWidth: 100,
        Cell: d => {
          return (
            <div>
              {Object.keys(d.value).length}
            </div>
          )
        },
        sortMethod: (a, b) => {
          if (Object.keys(a).length === Object.keys(b).length) {
            return a > b ? 1 : -1;
          }
          return Object.keys(a).length > Object.keys(b).length ? 1 : -1;
        }
      },
      {
        Header: 'Actions',
        Cell: d => {
          return (
            <div>
              <a className="btn btn-sm btn-secondary text-white" onClick={(e)=>{this.toggleShow(e,d)}}><FontAwesomeIcon icon="eye"/></a>
              { this.props.current_user.roles.includes("edit") &&
                <a className="btn btn-sm btn-secondary text-white ml-1" onClick={(e)=>{this.toggleUpdate(e,d)}}><FontAwesomeIcon icon="pen"/></a>
              }
            </div>
          )
        },
        className: "text-center",
        sortable: false,
        resizable: false,
        filterable: false
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
    let top_content = (
      <div className="float-left">
        { this.props.current_user.roles.includes("edit") &&
          <a className="btn btn-secondary text-white mb-3" onClick={this.toggleAdd}>
            <FontAwesomeIcon icon="plus"/>
          </a>
        }
      </div>
    );

    if (this.state.adding){
      top_content = <GroupForm
        action="create"
        current_user={this.props.current_user}
        handleNew={this.add}
        handleFormToggle={this.toggleAdd}
      />
    } else if (this.state.editing){
      top_content = <GroupForm
        action="update"
        group={this.state.selected}
        current_user={this.props.current_user}
        handleUpdate={this.update}
        handleDelete={this.delete}
        handleFormToggle={this.toggleUpdate}
      />
    } else if (this.state.showing){
      top_content = <Group
        group={this.state.selected}
        current_user={this.props.current_user}
        close={this.toggleShow}
      />
    }

    return (
      <div className="groups">
        <a className="btn btn-secondary text-white btn-sm" id="back-to-top" onClick={this.backToTop}><FontAwesomeIcon icon="arrow-up"/></a>
        <div className="card">
          <h2 className="card-title text-center mt-3">
            Groups
          </h2>

          <h4 className="text-center">
            (Filtered to {this.state.export_data.length} out of {Object.keys(this.state.groups).length})
          </h4>

          <div className="card-body">
            <div className="clearfix">
              {top_content}

              <CSVLink
                data={this.state.export_data}
                className="btn btn-secondary text-white mb-3 float-right"
                filename="CIRT_people_export.csv"
                title="Export Current Table"
              >
                <FontAwesomeIcon icon="file-export"/>
              </CSVLink>
            </div>

            <ReactTable
              data={Object.values(this.state.groups)}
              minRows={1}
              columns={this.columnDefs()}
              filterable
              defaultPageSize={100}
              ref={(r)=>this.reactTable=r}
              onSortedChange={this.setExport}
              onFilteredChange={this.setExport}
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
              }
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
      prevState.group = this.copy(nextProps.group);
      return prevState;
    })
  }
}

export default Groups;
