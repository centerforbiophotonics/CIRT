import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faPlus)

import PersonSearch from '../people/person_search';
import PersonForm from '../people/person_form';

import EventSearch from '../events/event_search';
import EventForm from '../events/event_form';

class PersonEventForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string, 
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    person_event: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke after successfully updating or creating a record via AJAX. */
    handleUpdate: PropTypes.func,
    /** @type {function} A handler to invoke after successfully creating a record via AJAX. */
    handleNew: PropTypes.func,
    /** @type {function} A handler to invoke after successfully deleting a record via AJAX. */
    handleDelete: PropTypes.func,
    /** @type {function} A handler that hides/closes the form. */
    handleFormToggle: PropTypes.func,
    /** @type {string} The parent model name to be used if this component is nested within another to hide fields set by the parent (id fields). */
    parent_model: PropTypes.string,
    /** @type {object} The parent object this record belong to. */
    parent: PropTypes.object,
  };

  static defaultProps = {
    person_event: {}
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handlePersonEditToggle = this.handlePersonEditToggle.bind(this);
    this.handleEventEditToggle = this.handleEventEditToggle.bind(this);

    this.handlePersonSelected = this.handlePersonSelected.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);

    this.valid = this.valid.bind(this);
    this.defaults = this.defaults.bind(this);
    this.copy = this.copy.bind(this);

    this.renderPersonSelector = this.renderPersonSelector.bind(this);
    this.renderEventSelector = this.renderEventSelector.bind(this);

    this.state = {
      person_event: this.copy(this.props.person_event),
      editing_event: (this.props.action == "create" ? true : false),
      editing_person: (this.props.action == "create" ? true : false)
    }

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }

  /** 
   * A keypress event handler for all form inputs that sets the corresponding state variable using the inputs name attribute.  
   * @public
   */
  handleChange(e){
    console.log(e);
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    let name = ""
    let value = ""
    if (e.target){
      name = e.target.name;
      value = e.target.value;
    } else {
      name = "status";
      value = e.value;
    }
    

    this.setState(prevState => {
      prevState.person_event[name] = value;
      return prevState;
    });
  }

  /** 
   * A click event handler that sends an AJAX call to delete the record.  
   * @public
   */
  handleDelete(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();
    
    fetch("/person_events/"+this.props.person_event.id, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include'
    }).then(res => res.json())
      .then(this.props.handleDelete,
        (error) => {
          this.setState({
            error:error 
          });
        }
      )
  }

  /** 
   * A click event handler that sends an AJAX call to update or create the record.  
   * @public
   */
  handleSubmit(e){
    let action = this.props.action;

    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();
    
    if (action == "create"){
      fetch('/person_events',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: this.headers,
        credentials: 'same-origin'
      }).then(res => res.json())
        .then(this.props.handleNew,
          (error) => {
            this.setState({
              error:error 
            });
          }
        )
    } else if (action == "update") {
      fetch("/person_events/"+this.props.person_event.id,{
        method: 'PUT',
        body: JSON.stringify(this.state),
        headers: this.headers,
        credentials: 'same-origin'
      }).then(res => res.json())
        .then(this.props.handleUpdate,
          (error) => {
            this.setState({
              error:error 
            });
          }
        )
    } 
  }

  handlePersonEditToggle(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    this.setState(prevState => {
      prevState.editing_person = !prevState.editing_person
      return prevState;
    });
  }

  handleEventEditToggle(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    this.setState(prevState => {
      prevState.editing_event = !prevState.editing_event
      return prevState;
    });
  }


  /** 
   * Handler invoked by PersonSearch component which sets the associated person id.
   * @param {object} person - A person object
   */
  handlePersonSelected(person){
    this.setState(prevState => {
      prevState.person_event.person_id = person.id;
      prevState.person_event.person = person;
      prevState.editing_person = false;
      return prevState;
    });
  }

  /** 
   * Handler invoked by EventSearch component which sets the associated event id.
   * @param {object} event - A event object
   */
  handleEventSelected(event){
    this.setState(prevState => {
      prevState.person_event.event_id = event.id;
      prevState.person_event.event = event;
      prevState.editing_event = false;
      return prevState;
    });
  }

  /**
   * A function that indicates if the form is in a valid state to be submitted to the server.
   * @return {boolean} Is the form in a valid state?
   * @public
   */
  valid(){
    let person_event = this.state.person_event;
    return true;
  }

  /**
   * A function that provides a record with all attributes set to default values.
   * @return {object} A record with default attribute values.
   * @public
   */
  defaults(){
    return {
      event_id: (this.props.parent_model === "Event" ? this.props.parent.id : ""),
      person_id: (this.props.parent_model === "Person" ? this.props.parent.id : ""),
      status: ""
    }
  }

  /**
   * An function that recieves a record, clones it to avoid reference errors, and replaces null values with their default values.
   * @param {object} A record to copy
   * @return {object} A copy of the provided record with nulls replaced by defaults.
   * @public
   */
  copy(obj){
    let copiedObj = JSON.parse(JSON.stringify(obj));
    for (var key in this.defaults()){
      if (copiedObj[key] === null || copiedObj[key] === undefined){
        copiedObj[key] = this.defaults()[key];
      }
    }
    return copiedObj;
  }

  /*
   * Returns an interface for searching for an existing person or creating a new one.
   * @param {string} className - a class to apply to the outermost div
   * @param {string} id - an id to apply to the outmost div
   * @public
   */
  renderPersonSelector(){
    return (
      <div className="ml-3">
        {(this.props.action != "create" || this.state.person_event.person_id != "") &&
          <a className="btn btn-sm btn-secondary text-white" role="button" onClick={this.handlePersonEditToggle} aria-expanded="false" aria-controls="person_edit"><FontAwesomeIcon icon="pen"/></a>
        }
        {this.state.editing_person &&
          <div id="person_edit">
            <PersonSearch handleResultSelected={this.handlePersonSelected} />
            Or create a new one <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#person_create" role="button" aria-expanded="false" aria-controls="person_create"><FontAwesomeIcon icon="plus"/></a>
            <div className="collapse" id="person_create">
              <PersonForm 
                action="create" 
                current_user={this.props.current_user}
                handleNew={this.handlePersonSelected}
                parent_model={this.props.parent_model}
              /> 
            </div>
          </div>
        }
        
      </div>
    )
  }

  /*
   * Returns an interface for searching for an existing event or creating a new one.
   * @param {string} className - a class to apply to the outermost div
   * @param {string} id - an id to apply to the outmost div
   * @public
   */
  renderEventSelector(){
    return (
      <div className="ml-3">
        {(this.props.action != "create" || this.state.person_event.event_id != "") &&
          <a className="btn btn-sm btn-secondary text-white" role="button" onClick={this.handleEventEditToggle} aria-expanded="false" aria-controls="event_edit"><FontAwesomeIcon icon="pen"/></a>
        }
        {this.state.editing_event && 
          <div id="event_edit">
            <EventSearch handleResultSelected={this.handleEventSelected} />
            Or create a new one <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#event_create" role="button" aria-expanded="false" aria-controls="event_create"><FontAwesomeIcon icon="plus"/></a>
            <div className="collapse" id="event_create">
              <EventForm 
                action="create" 
                current_user={this.props.current_user}
                handleNew={this.handleEventSelected}
                parent_model={this.props.parent_model}
              /> 
            </div>
          </div>
        }
      </div>
    )
  }

  /**
   * The render lifecycle method.
   * @public
   */
  render(){

    let person_event = this.state.person_event;
    let action = this.props.action;

    let button_text = null;
    if (action == "create"){
      button_text = "Create";
    } else if (action == "update"){
      button_text = "Update";
    } 

    let title = null;
    if (action == "create"){
      title = "Creating A New PersonEvent";
    } else if (action == "update"){
      title = "Editing " + "PersonEvent";
    }

    let buttons = (
      <div className="form-actions">
        <button type="button" className="btn btn-danger text-white" onClick={this.handleSubmit} disabled={!this.valid()}>{button_text}</button>
        {action == "update" ? 
          <button type="button" className="btn btn-danger text-white ml-3" onClick={this.handleDelete} disabled={!this.valid()}>Delete</button>
          : null
        }
        <button type="button" className="btn btn-danger text-white ml-3" onClick={this.props.handleFormToggle}>Cancel</button>         
      </div>
    )

    return (
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div>
            {buttons}

            {this.props.parent_model != "Group" &&
              <div className="form-group">
                <label htmlFor="event_name" className="font-weight-bold">Event</label>
                {person_event.event &&
                  <p className="ml-3" id="event_name col-10">{person_event.event.name}</p>
                }
                {this.renderEventSelector()}
              </div>
            }

            {this.props.parent_model != "Person" &&
              <div className="form-group">
                <label htmlFor="person_name" className="font-weight-bold">Person</label>
                {person_event.person &&
                  <p className="ml-3" id="person_name">{person_event.person.name}</p>
                }
                {this.renderPersonSelector()}
              </div>
            } 

            <div className="form-group">
              <label htmlFor="status" className="font-weight-bold">Status</label>
              <Select
                id="status"
                value={{value: person_event.status, label: person_event.status}}
                onChange={this.handleChange}
                options={[
                  {value:"Attended", label:"Attended"}, 
                  {value:"Registered", label:"Registered"}
                ]}
              />
            </div>

            {buttons}
            
          </div>
        </div>
      </div>
    )
  }

  /**
   * The componentWillReceiveProps lifecycle method. Because the form state is initially set from a prop, if the prop is updated the needs to update its state.
   * @public
   */
  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      prevState.person_event = (nextProps.person_event ? this.copy(nextProps.person_event) : this.defaults());
      return prevState;
    })
  }
}

export default PersonEventForm;