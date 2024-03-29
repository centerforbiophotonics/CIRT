import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class UserForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string,
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    user: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke after successfully updating or creating a record via AJAX. */
    handleUpdate: PropTypes.func,
    /** @type {function} A handler to invoke after successfully deleting a record via AJAX. */
    handleDelete: PropTypes.func,
    /** @type {function} A handler that hides/closes the form. */
    handleFormToggle: PropTypes.func
  };

  static defaultProps = {
    user: {}
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
    this.valid = this.valid.bind(this);
    this.defaults = this.defaults.bind(this);
    this.copy = this.copy.bind(this);

    this.state = {
      user: (this.props.user ? this.copy(this.props.user) : this.defaults())
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
   * A keypress or change event handler for all form inputs that sets the corresponding state variable using the inputs name attribute.
   * @public
   */
   handleChange(e){
     if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false && (e.target === undefined || e.target.type !== 'checkbox'))
       e.preventDefault();

     let name = null;
     let value = null;

     if (Array.isArray(e)){
       name = "roles"
       value = e.map(v => v.value);
     } else if (e.target.type === 'checkbox') {
       console.log("checkbox")
       name = e.target.name;
       value = !this.state.user[name];
     } else {
       name = e.target.name;
       value = e.target.value;
     }

     this.setState(prevState => {
       prevState.user[name] = value;
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

    if (confirm("Are you sure you want to delete this user? It's usually better to revoke their access by giving them the role 'no_access'.")){
      fetch("/users/"+this.props.user.id, {
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
  }

  /**
   * A click event handler that sends an AJAX call to update or create the record.
   * @public
   */
  handleSubmit(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    if (this.props.action == "create"){
      fetch('/users',{
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
      fetch("/users/"+this.props.user.id,{
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
    let user = this.state.user;
    return true;
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
      cas_user: "",
      roles: []
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

    let user = this.state.user;

    let button_text = null;
    if (this.props.action == "create"){
      button_text = "Create";
    } else if (this.props.action == "update"){
      button_text = "Update";
    }

    let title = null;
    if (this.props.action == "create"){
      title = "Creating A New User";
    } else if (this.props.action == "update"){
      title = "Editing "+user.name;
    }

    let buttons = (
      <div className="form-actions">
        <a className="btn btn-danger text-white" onClick={this.handleSubmit} disabled={!this.valid()}>{button_text}</a>
        {this.props.action == "update" ?
          <a className="btn btn-danger text-white ml-3" onClick={this.handleDelete} disabled={!this.valid()}>Delete</a>
          : null
        }
        <a className="btn btn-danger text-white ml-3" onClick={this.props.handleFormToggle}>Cancel</a>
      </div>
    )

    return (
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div>
            {buttons}
            <div className="form-group">
              <label htmlFor="name" className="font-weight-bold">Name</label>
              <input type="text" className="form-control" id="name" name="name" aria-describedby="name_help" value={user.name} placeholder="Enter Name" onChange={this.handleChange}/>
              <small id="name_help" className="form-text text-muted">Help text placeholder.</small>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="font-weight-bold">Email</label>
              <input type="text" className="form-control" id="email" name="email" aria-describedby="email_help" value={user.email} placeholder="Enter Email" onChange={this.handleChange}/>
              <small id="email_help" className="form-text text-muted">Help text placeholder.</small>
            </div>

            <div className="form-group">
              <label htmlFor="cas_user" className="font-weight-bold">Cas User</label>
              <input type="text" className="form-control" id="cas_user" name="cas_user" aria-describedby="cas_user_help" value={user.cas_user} placeholder="Enter Cas User" onChange={this.handleChange}/>
              <small id="cas_user_help" className="form-text text-muted">Help text placeholder.</small>
            </div>

            <div className="form-group">
                <label
                  htmlFor="roles"
                  className="font-weight-bold"
                >
                  Roles
                </label>
                <Select
                  type="text"
                  id="roles"
                  name="roles"
                  value={user.roles.map(r => ({value: r, label: r}))  }
                  isMulti={true}
                  options={this.props.role_list.map(r => ({value: r, label: r}))}
                  placeholder="No Roles Assigned (no access)"
                  onChange={this.handleChange}
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
      prevState.user = (nextProps.user ? this.copy(nextProps.user) : this.defaults());
      return prevState;
    })
  }
}

export default UserForm;
