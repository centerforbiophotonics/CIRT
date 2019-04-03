import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { CSVLink } from 'react-csv';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport, faBroom, faBullhorn, faLowVision} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faEye, faPlus, faArrowUp, faFileImport, faFileExport, faBroom, faBullhorn, faLowVision )

import Person from './person';
import PersonForm from './person_form';
import PersonList from './person_list';
import PeopleImport from './people_import';
import PeopleCleaner from './people_cleaner';

import EventFilter from '../events/event_filter';
import PersonEventTableCell from './person_event_table_cell';
import GroupFilter from '../groups/group_filter';
import PersonGroupTableCell from './person_group_table_cell';


/**
 * User interface for listing, filtering and exporting People. Renders subcomponents for CRUD actions. Can be used a root component or rendered from the form or show component of an associated model. 
 */
class People extends React.Component {
  static propTypes = {
    /** A hash of person ids to objects containing their attributes and associated models' attributes. */
    people: PropTypes.object,
    /** @type {object} The user who requested the page. The users roles array can be used for authorization. */
    current_user: PropTypes.object,
    /** @type {function} If this component is used by another to display its associations it can provide a handler which this component will call to update the parent state after it has changed. */
    handleUpdate: PropTypes.func,
    /** @type {string} The parent model name to be used if this component is nested within another to hide fields set by the parent (id fields). */
    parent_model: PropTypes.string,
    /** @type {object} The parent object these records belong to. */
    parent: PropTypes.object,
    /** @type {number} Passed to ReactTable to set the initial number of rows per page. */
    defaultPageSize: PropTypes.number,
    /** @type {number} The last time all users were retrieved from IAM. */
    last_iam_lookup: PropTypes.string,
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
        
    this.toggleAdd = this.toggleAdd.bind(this);
    this.add = this.add.bind(this);
    this.toggleImport = this.toggleImport.bind(this);
    this.import = this.import.bind(this);
    this.toggleCleaning = this.toggleCleaning.bind(this);
    this.clean = this.clean.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.update = this.update.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.delete = this.delete.bind(this);
    this.columnDefs = this.columnDefs.bind(this);
    this.backToTop = this.backToTop.bind(this);
    this.copy = this.copy.bind(this);
    this.setExport = this.setExport.bind(this);

    this.toggleAlert = this.toggleAlert.bind(this);

    this.state = {
      /** @type {Object} A hash of the records to display */
      people: this.copy(props.people),
      /** @type {Boolean} Whether the create menu is visible */
      adding: false,
      /** @type {Boolean} Whether the show view is visible */
      showing: false,
      /** @type {Boolean} Whether the edit menu is visible */
      editing: false,
      /** @type {Boolean} Whether the import menu is visible */
      importing: false,
      /** @type {Boolean} The record currently being displayed in either the show, add, or edit component. */
      selected: null,
      /** @type {Array} The data that has been sorted and filtered by react table for export via CSVLink */
      export_data: [],
      /** @type {Boolean} Whether the page alert box is showing. */
      status_showing: false,
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
   * @param {object} person - The model instance to add to the current state.
   * @public
   */
  add(person) {
    this.setState(function(prevState, props){
      prevState.people[person.id] = person;
      prevState.adding = false;

      prevState.editing = true;
      prevState.selected = person;

      prevState.status_showing = true;
      prevState.status_message = person.name+" created.";
      prevState.status_message_type = "success";
      
      return prevState;
    });
  }

  /** 
   * Click handler that toggles the import menu. 
   * @public
   */
  toggleImport(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();
    
    this.setState(prevState => ({
      importing: !prevState.importing,
      adding: false,
      editing: false,
      showing: false,
      cleaning: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after the import form succeeds in adding a new model instance(s) to update the client state. 
   * @param {object} person - The model instance to add to the current state.
   * @public
   */
  import(people) {
    this.setState(function(prevState, props){
      prevState.status_showing = true;
      prevState.status_message = people.length+" people created.";
      prevState.status_message_type = "success";
      
      return prevState;
    });
  }

  /** 
   * Click handler that toggles the cleanup menu. 
   * @public
   */
  toggleCleaning(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();
    
    this.setState(prevState => ({
      cleaning: !prevState.cleaning,
      adding: false,
      editing: false,
      showing: false,
      importing: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after the cleanup form succeeds in updating and removing model instances. 
   * @param {object} person - The model instance to add to the current state.
   * @public
   */
  clean(people) {
    this.setState(function(prevState, props){
      people.updated.forEach(p => {
        prevState.people[p.id] = p;
      });

      people.deleted.forEach(p => {
        delete prevState.people[p.id];
      });

      prevState.status_showing = true;
      prevState.status_message = (
        (people.updated.length > 0 && 
          people.updated.length + " people updated. "
        )+
        (people.deleted.length > 0 && 
          people.deleted.length + " people deleted. "
        )
      );
      prevState.status_message_type = "success";

      prevState.showing = true;
      prevState.cleaning = false;
      prevState.selected = people.updated[0]
      
      return prevState;
    });

    this.backToTop();
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
      editing: (d === undefined ? false : true),
      showing: false,
      adding: false,
      importing: false,
      cleaning: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after a form succeeds in editing a model instance to update the client state. 
   * @param {object} person - The updated model instance replace in the current state.
   * @public
   */
  update(person){
    this.setState(function(prevState, props){
      prevState.people[person.id] = person;

      prevState.status_showing = true;
      prevState.status_message = person.name+" updated.";
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
      showing: (d === undefined ? false : true),
      editing: false,
      adding: false,
      importing: false,
      cleaning: false
    }));

    this.backToTop();
  }

  /** 
   * Handler invoked after a form succeeds in deleting a model instance to update the client state. 
   * @param {object} person - The deleted model instance remove from the current state.
   * @public
   */
  delete(person){
    this.setState(function(prevState, props){
      delete prevState.people[person.id];
      prevState.selected = null;
      prevState.editing = false;

      prevState.status_showing = true;
      prevState.status_message = person.name+" deleted.";
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
      { Header: 'ID', accessor: 'id', maxWidth: 75},
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      // { Header: 'Pidm', accessor: 'pidm' },
      // { Header: 'Sid', accessor: 'sid' },
      // { Header: 'Emp', accessor: 'emp_id' },
      // { Header: 'Iam', accessor: 'iam_id' },
      // { Header: 'Cas User', accessor: 'cas_user' },
      // { Header: 'Dems', accessor: 'dems_id' },
      // { Header: 'Cims', accessor: 'cims_id' },
      { Header: 'Affiliations',
        accessor: 'person_groups',
        maxWidth: 100,
        Cell: d => (<PersonGroupTableCell person_groups={d.value}/>),
        filterMethod: (filter, row) => {
          return filter.value.includes(row._original.id);
        },
        Filter: ({ filter, onChange }) =>
          <GroupFilter 
            title="Show people who . . . "
            apply={value => onChange(value)}
          />,
        sortMethod: (a, b) => {
          if (Object.keys(a).length === Object.keys(b).length) {
            return a > b ? 1 : -1;
          }
          return Object.keys(a).length > Object.keys(b).length ? 1 : -1;
        }
      },
      { Header: 'Events',
        accessor: 'person_events',
        maxWidth: 100,
        Cell: d => (<PersonEventTableCell person_events={d.value}/>),
        filterMethod: (filter, row) => {
          return filter.value.includes(row._original.id);
        },
        Filter: ({ filter, onChange }) =>
          <EventFilter 
            title="Show people who . . . "
            apply={value => onChange(value)}
          />,
        sortMethod: (a, b) => {
          if (Object.keys(a).length === Object.keys(b).length) {
            return a > b ? 1 : -1;
          }
          return Object.keys(a).length > Object.keys(b).length ? 1 : -1;
        }

      },
      { Header: 'Funds Given',
        accessor: 'person_funds',
        maxWidth: 130,
        Cell: d => {
          return (
            <div>
              {Object.keys(d.value).length}
            </div>
          )
        },
        filterMethod: (filter, row) => {

        },
        Filter: ({ filter, onChange }) =>
          <EventFilter title="Show people who . . . "/>,
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
      // this.setState({
      //   export_data: this.reactTable.getResolvedState().sortedData.map((r) => {
      //     return {
      //       name: r._original.name,
      //       email: r._original.email,
      //       roles: r._original.roles.join(" and "),
      //       tou_agreed: Object.values(r._original.person_groups).map(pg => (pg.role+" in "+pg.group.name)).join(", ")
      //     }
      //     return r._original;
      //   })
      // });
  }

  
  /**
   * Toggles a state variable to determine if the alert prompt is shown or not.
   * @public
   */
  toggleAlert(){
    this.setState(prevState => {
      prevState.status_showing = !prevState.status_showing;

      return prevState;
    });

    this.backToTop();
  }
  
  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    

    return (
      <div className="people col-md-12 p-0" id="people">
        <a 
          className="btn btn-secondary text-white btn-sm" 
          id="back-to-top" 
          onClick={this.backToTop}
        >
          <FontAwesomeIcon icon="arrow-up"/>
        </a> 
        <div className="card">
          <h2 className="card-title text-center mt-3">
            People     
          </h2>

          <h4 className="text-center">
            (Filtered to {this.state.export_data.length} out of {Object.keys(this.state.people).length})
          </h4>

          <p className="text-center">
            Last all person IAM lookup: {this.props.last_iam_lookup}
          </p>

          <div className="card-body">
            <div className="clearfix">
              {
                this.state.status_showing ?
                  <div 
                    className={"alert alert-"+this.state.status_message_type+" alert-dismissible mx-5"} 
                    role={this.state.status_message_type}
                  >
                    <button type="button" className="close" aria-label="Close" onClick={this.toggleAlert}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h3>{this.state.status_message}</h3>
                  </div>
                : this.state.status_message != "" ?
                  <div className="float-right mb-3">
                    <a 
                      className="btn btn-secondary text-white" 
                      onClick={this.toggleAlert}
                      title="Show Page Alerts"
                    >
                      <FontAwesomeIcon icon="bullhorn"/>
                    </a>
                  </div>
                : null
              }
            </div>
            

            <div className="clearfix">
              {
                this.state.adding ?   
                  <PersonForm 
                    action="create" 
                    current_user={this.props.current_user}
                    handleNew={this.add}
                    handleFormToggle={this.toggleAdd}
                  />
                : this.state.editing ?
                  <PersonForm 
                    action="update" 
                    person={this.state.selected} 
                    current_user={this.props.current_user}
                    handleUpdate={this.update} 
                    handleDelete={this.delete}
                    handleFormToggle={this.toggleUpdate}
                  />
                : this.state.showing ?
                  <Person 
                    person={this.state.selected}
                    current_user={this.props.current_user}
                    close={this.toggleShow}
                  />
                : this.state.importing ?
                  <PeopleImport 
                    people={this.state.people}
                    close={this.toggleImport}
                  />
                : this.state.cleaning ?
                  <PeopleCleaner 
                    people={this.state.people}
                    close={this.toggleCleaning}
                    merge={this.clean}
                  />
                : 
                  <div className="float-left">
                    <a 
                      className="btn btn-secondary text-white mb-3" 
                      onClick={this.toggleAdd}
                      title="Manually Add a Person"
                    >
                      <FontAwesomeIcon icon="plus"/>
                    </a>

                    <a 
                      className="btn btn-secondary text-white mb-3 ml-1" 
                      onClick={this.toggleImport}
                      title="Import People From CSV"
                    >
                      <FontAwesomeIcon icon="file-import"/>
                    </a>

                    <a 
                      className="btn btn-secondary text-white mb-3 ml-1" 
                      onClick={this.toggleCleaning}
                      title="Clean and Bulk Update Data"
                    >
                      <FontAwesomeIcon icon="broom"/>
                    </a>

                    <a 
                      className="btn btn-secondary text-white mb-3 ml-1" 
                      onClick={() => {}}
                      title="Column Visibility"
                    >
                      <FontAwesomeIcon icon="low-vision"/>
                    </a>

                  </div>
              }
               
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
              data={Object.values(this.state.people)}
              minRows={1}
              columns={this.columnDefs()}
              filterable
              defaultPageSize={this.props.defaultPageSize}
              ref={(r)=>this.reactTable=r}
              onSortedChange={this.setExport}
              onFilteredChange={this.setExport}
              getTrProps={(state, rowInfo, instance) => {
                if (rowInfo && this.state.selected != null && rowInfo.original.id == this.state.selected.id)
                  return {
                    style: {backgroundColor: "lightyellow"}
                  };
                else
                  return {}
              }}
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
  // componentWillReceiveProps(nextProps) {
  //   this.setState(prevState => {
  //     prevState.person = this.copy(nextProps.person);
  //     return prevState;
  //   })
  // }
}

export default People;