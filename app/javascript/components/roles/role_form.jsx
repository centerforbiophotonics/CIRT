import React from 'react';
import PropTypes from 'prop-types';

import { WithContext as ReactTags } from 'react-tag-input';

class RoleForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string, 
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    role: PropTypes.object,
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
    role: {}
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

    this.handleVariantDelete = this.handleVariantDelete.bind(this);
    this.handleVariantAddition = this.handleVariantAddition.bind(this);
    this.handleVariantDrag = this.handleVariantDrag.bind(this);

    this.state = {
      role: this.copy(this.props.role)
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
      prevState.role[name] = value;
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
    
    if (confirm("Are you sure you want to delete this role?"))
      fetch("/roles/"+this.props.role.id, {
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
        );
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
      fetch('/roles',{
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
      fetch("/roles/"+this.props.role.id,{
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
    let role = this.state.role;
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
      variants: []
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

  handleVariantDelete(i) {
    this.setState(prevState => {
      prevState.role.variants = prevState.role.variants.filter((variant, index) => index !== i);
      return prevState;
    });
  }

  handleVariantAddition(variant) {
    this.setState(prevState => {
      prevState.role.variants.push(variant.text);
      return prevState;
    });
  }

  handleVariantDrag(variant, currPos, newPos) {
    this.setState(prevState => {
      const variants = [...prevState.role.variants];
      const newVariants = variants.slice();

      newVariants.splice(currPos, 1);
      newVariants.splice(newPos, 0, variant.text);

      prevState.role.variants = newVariants;

      return prevState;
    }); 
  }

  /**
   * The render lifecycle method.
   * @public
   */
  render(){

    let role = this.state.role;
    let action = this.props.action;

    let button_text = null;
    if (action == "create"){
      button_text = "Create";
    } else if (action == "update"){
      button_text = "Update";
    } 

    let title = null;
    if (action == "create"){
      title = "Creating A New Role";
    } else if (action == "update"){
      title = "Editing " + role.name;
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

            <div className="alert alert-warning mt-3" role="alert">
              <p>
                Edit with great caution!
              </p>

              <p>
                Role names appear here exactly as they were retrieved from various campus sources. 
                If a role is not descriptive or clear enough, add it as a variant of a more descriptive role
                using the merge menu accessible by clicking the broom icon that is visible when this menu is closed.
                You may have to create a new role with a clear, concise name to use.
              </p>

              <p className="mb-0">
                Example: The role "LECT SOE-AY" and "LECT SOE-FY" could be added as variants of "LPSOE".
              </p>
            </div>


            <div className="form-group">
              <label htmlFor="name" className="font-weight-bold">Name</label>
              <input type="text" className="form-control" id="name" name="name" aria-describedby="name_help" value={role.name} placeholder="Enter Name" onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <label htmlFor="variants" className="font-weight-bold">Variants</label>
              <ReactTags
                id="variants"
                tags={role.variants.map(t => ({id: t, text:t}))}
                handleDelete={this.handleVariantDelete}
                handleAddition={this.handleVariantAddition}
                handleDrag={this.handleVariantDrag}
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
      prevState.role = (nextProps.role ? this.copy(nextProps.role) : this.defaults());
      return prevState;
    })
  }
}

export default RoleForm;