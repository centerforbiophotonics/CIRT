import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faPlus)

import PersonSearch from '../people/person_search';
import GroupSearch from '../groups/group_search';
import GroupForm from '../groups/group_form';

class PersonGroupForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string, 
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    person_group: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke after successfully updating or creating a record via AJAX. */
    handleUpdate: PropTypes.func,
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
    person_group: {}
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

    this.handlePersonSelected = this.handlePersonSelected.bind(this);
    this.handleGroupSelected = this.handleGroupSelected.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.valid = this.valid.bind(this);
    this.defaults = this.defaults.bind(this);
    this.copy = this.copy.bind(this);

    this.renderGroupSelector = this.renderGroupSelector.bind(this);
    

    this.state = {
      person_group: this.copy(this.props.person_group)
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
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => {
      prevState.person_group[name] = value;
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
    
    fetch("/person_groups/"+this.props.person_group.id, {
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
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();
    
    if (this.props.action == "create"){
      fetch('/person_groups',{
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
    } else if (this.props.action == "update") {
      fetch("/person_groups/"+this.props.person_group.id,{
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

  /** 
   * Handler invoked by PersonSearch component which sets the associated person id.
   * @param {object} person - A person object
   */
  handlePersonSelected(person){
    this.setState(prevState => {
      prevState.person_group.person_id = person.id
      prevState.person_group.person = person
      return prevState;
    });
  }

  /** 
   * Handler invoked by GroupSearch component which sets the associated group id.
   * @param {object} group - A group object
   */
  handleGroupSelected(group){
    this.setState(prevState => {
      prevState.person_group.group_id = group.id
      prevState.person_group.group = group
      return prevState;
    });
  }

  /**
   * A function that indicates if the form is in a valid state to be submitted to the server.
   * @return {boolean} Is the form in a valid state?
   * @public
   */
  valid(){
    let person_group = this.state.person_group;

    return (person_group.person_id != "" && person_group.group_id != "");
  }

  /**
   * A function that provides a record with all attributes set to default values.
   * @return {object} A record with default attribute values.
   * @public
   */
  defaults(){
    return {
      group_id: (this.props.parent_model === "Group" ? this.props.parent.id : ""),
      person_id: (this.props.parent_model === "Person" ? this.props.parent.id : ""),
      role: "",
      start: "",
      end: ""
    }
  }

  /**
   * An function that recieves a record, clones it to avoid reference errors, and replaces null values with their default values.
   * @param {object} A record to copy
   * @return {object} A copy of the provided record with nulls replaced by defaults.
   * @public
   */
  copy(obj){
    console.log(this.defaults());

    let copiedObj = JSON.parse(JSON.stringify(obj));
    for (var key in this.defaults()){
      if (copiedObj[key] === null || copiedObj[key] === undefined){
        copiedObj[key] = this.defaults()[key];
      }
    }
    return copiedObj;
  }

  renderGroupSelector(className){
    return (
      <div className={className} id="group_edit">
        <GroupSearch handleResultSelected={this.handleGroupSelected} />
        Or create a new one <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#group_create" role="button" aria-expanded="false" aria-controls="group_create"><FontAwesomeIcon icon="plus"/></a>
        <div className="collapse" id="group_create">
          <GroupForm 
            handleUpdate={this.handleGroupSelected} 
            action="create" 
            current_user={this.props.current_user}
            handleNew={this.handleGroupSelected}
            parent_model={this.props.parent_model}
          /> 
        </div>
      </div>
    )
  }

  /**
   * The render lifecycle method.
   * @public
   */
  render(){

    let person_group = this.state.person_group;

    let button_text = null;
    if (this.props.action == "create"){
      button_text = "Create";
    } else if (this.props.action == "update"){
      button_text = "Update";
    } 

    let title = null;
    if (this.props.action == "create"){
      title = "Creating A New Group Association";
    } else if (this.props.action == "update"){
      title = "Editing Group Association";
    }

    let buttons = (
      <div className="form-actions">
        <button type="button" className="btn btn-danger text-white" onClick={this.handleSubmit} disabled={!this.valid()}>{button_text}</button>
        {this.props.action == "update" ? 
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
          {buttons}
          <div className="row">
            <div className="col-md-6">
              {this.props.parent_model != "Group" &&
                <div className="form-group">
                  {person_group.group ? 
                    <div>
                      <label htmlFor="group_name" className="font-weight-bold">Group</label>
                      <p id="group_name">{person_group.group.name}</p>
                      <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#group_edit" role="button" aria-expanded="false" aria-controls="group_edit"><FontAwesomeIcon icon="pen"/></a>
                      {this.renderGroupSelector("collapse")}
                    </div>
                    :
                    <div>
                      {this.renderGroupSelector()}
                    </div>
                  }
                  
                </div>
              }

              {this.props.parent_model != "Person" &&
                <div className="form-group">
                  <label htmlFor="person_id" className="font-weight-bold">Person</label>
                  <input type="hidden" className="form-control" id="person_id" name="person_id" aria-describedby="person_id_help" value={person_group.person_id} placeholder="Enter Person" onChange={this.handleChange}/>
                  <PersonSearch handleResultSelected={this.handlePersonSelected} />
                  <small id="person_id_help" className="form-text text-muted">Help text placeholder.</small>
                </div>
              }
            </div>
            
            <div className="col-md-6">  
              <div className="form-group">
                <label htmlFor="role" className="font-weight-bold">Role</label>
                <input type="text" className="form-control" id="role" name="role" aria-describedby="role_help" value={person_group.role} placeholder="Enter Role" onChange={this.handleChange}/>
                <small id="role_help" className="form-text text-muted">Help text placeholder.</small>
              </div>

              <div className="form-group">
                <label htmlFor="start" className="font-weight-bold">Start</label>
                <input type="text" className="form-control" id="start" name="start" aria-describedby="start_help" value={person_group.start} placeholder="Enter Start" onChange={this.handleChange}/>
                <small id="start_help" className="form-text text-muted">Help text placeholder.</small>
              </div>

              <div className="form-group">
                <label htmlFor="end" className="font-weight-bold">End</label>
                <input type="text" className="form-control" id="end" name="end" aria-describedby="end_help" value={person_group.end} placeholder="Enter End" onChange={this.handleChange}/>
                <small id="end_help" className="form-text text-muted">Help text placeholder.</small>
              </div>
            </div>   
          </div>
          {buttons}
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
      prevState.person_group = (nextProps.person_group ? this.copy(nextProps.person_group) : this.defaults());
      return prevState;
    })
  }
}

export default PersonGroupForm;