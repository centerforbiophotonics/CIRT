import React from 'react';
import PropTypes from 'prop-types';

import PersonGroupForm from '../person_groups/person_group_form';
import PersonGroups from '../person_groups/person_groups';

class PersonForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string, 
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    person: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke after successfully updating or creating a record via AJAX. */
    handleUpdate: PropTypes.func,
    /** @type {function} A handler to invoke after successfully deleting a record via AJAX. */
    handleDelete: PropTypes.func,
    /** @type {function} A handler that hides/closes the form. */
    handleFormToggle: PropTypes.func
  }

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
    this.valid = this.valid.bind(this);
    this.defaults = this.defaults.bind(this);
    this.copy = this.copy.bind(this);

    this.state = {
      person: (this.props.person ? this.copy(this.props.person) : this.defaults()),

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
      prevState.person[name] = value;
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
    
    fetch("/people/"+this.props.person.id, {
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
      fetch('/people',{
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
      fetch("/people/"+this.props.person.id,{
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
   * A function that indicates if the form is in a valid state to be submitted to the server.
   * @return {boolean} Is the form in a valid state?
   * @public
   */
  valid(){
    let person = this.state.person;
    return (person.name !== "" && person.email !==   "");
  }

  /**
   * A function that provides a record with all attributes set to default values.
   * @return {object} A record with default attribute values.
   * @public
   */
  defaults(){
    return {
      name: "",
      email: "",
      pidm: "",
      sid: "",
      emp_id: "",
      iam_id: "",
      cas_user: "",
      dems_id: "",
      cims_id: ""
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
    for (var key in copiedObj){
      if (copiedObj[key] === null){
        copiedObj[key] = this.defaults()[key];
      }
    }
    return copiedObj;
  }

  /**
   * The render lifecycle method.
   * @public
   */
  render(){

    let person = this.state.person;
    let action = this.props.action;

    let button_text = null;
    if (action == "create"){
      button_text = "Create";
    } else if (action == "update"){
      button_text = "Update";
    } 

    let title = null;
    if (action == "create"){
      title = "Creating A New Person";
    } else if (action == "update"){
      title = "Editing "+person.name;
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
            <div className="row">
              <div className="col-md-5">
                <div className="form-group">
                  <label htmlFor="name" className="font-weight-bold">Name</label>
                  <input type="text" className="form-control" id="name" name="name" aria-describedby="name_help" value={person.name} placeholder="Enter Name" onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="font-weight-bold">Email</label>
                  <input type="text" className="form-control" id="email" name="email" aria-describedby="email_help" value={person.email} placeholder="Enter Email" onChange={this.handleChange}/>
                </div>

                <a className="btn btn-primary m-1" data-toggle="collapse" href="#ids" role="button" aria-expanded="false" aria-controls="ids">
                  Toggle IDs (Edit Carefully)
                </a>
                
                <div className="collapse row m-1" id="ids">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="pidm" className="font-weight-bold">PIDM</label>
                      <input type="text" className="form-control" id="pidm" name="pidm" aria-describedby="pidm_help" value={person.pidm} placeholder="Enter Pidm" onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="sid" className="font-weight-bold">SID</label>
                      <input type="text" className="form-control" id="sid" name="sid" aria-describedby="sid_help" value={person.sid} placeholder="Enter Sid" onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="emp_id" className="font-weight-bold">Employee ID</label>
                      <input type="text" className="form-control" id="emp_id" name="emp_id" aria-describedby="emp_id_help" value={person.emp_id} placeholder="Enter Emp" onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="iam_id" className="font-weight-bold">IAM ID</label>
                      <input type="text" className="form-control" id="iam_id" name="iam_id" aria-describedby="iam_id_help" value={person.iam_id} placeholder="Enter Iam" onChange={this.handleChange}/>
                    </div>
                  </div>

                  <div className="col-md-4">

                    <div className="form-group">
                      <label htmlFor="cas_user" className="font-weight-bold">Kerberos User Name</label>
                      <input type="text" className="form-control" id="cas_user" name="cas_user" aria-describedby="cas_user_help" value={person.cas_user} placeholder="Enter Cas User" onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dems_id" className="font-weight-bold">DEMS ID</label>
                      <input type="text" className="form-control" id="dems_id" name="dems_id" aria-describedby="dems_id_help" value={person.dems_id} placeholder="Enter Dems" onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cims_id" className="font-weight-bold">CIMS ID</label>
                      <input type="text" className="form-control" id="cims_id" name="cims_id" aria-describedby="cims_id_help" value={person.cims_id} placeholder="Enter Cims" onChange={this.handleChange}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                {action == "create" ?
                  <h2>Create This Person To Add Associations</h2>
                  :
                  <div>
                    <a className="btn btn-primary m-1" data-toggle="collapse" href="#groups" role="button" aria-expanded="false" aria-controls="groups">
                      Toggle Groups
                    </a>
                    
                    <div className="collapse row" id="groups">
                      <PersonGroups
                        person_groups={person.person_groups}
                        parent_model="Person"
                        parent={person}
                        defaultPageSize={5}
                      />
                    </div>
                  </div>
                }

              </div>
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
      prevState.person = (nextProps.person ? this.copy(nextProps.person) : this.defaults());
      return prevState;
    })
  }
}

export default PersonForm;