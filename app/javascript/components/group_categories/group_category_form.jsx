import React from 'react';
import PropTypes from 'prop-types';

class GroupCategoryForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string, 
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    group_category: PropTypes.object,
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
    group_category: {}
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
      group_category: this.copy(this.props.group_category)
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
      prevState.group_category[name] = value;
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
    
    fetch("/group_categories/"+this.props.group_category.id, {
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
      fetch('/group_categories',{
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
      fetch("/group_categories/"+this.props.group_category.id,{
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
    let group_category = this.state.group_category;
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
      description: ""
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

  /**
   * The render lifecycle method.
   * @public
   */
  render(){

    let group_category = this.state.group_category;
    let action = this.props.action;

    let button_text = null;
    if (action == "create"){
      button_text = "Create";
    } else if (action == "update"){
      button_text = "Update";
    } 

    let title = null;
    if (action == "create"){
      title = "Creating A New Group Category";
    } else if (action == "update"){
      title = "Editing " + group_category.name;
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
            <div className="form-group">
              <label htmlFor="name" className="font-weight-bold">Name</label>
              <input type="text" className="form-control" id="name" name="name" aria-describedby="name_help" value={group_category.name} placeholder="Enter Name" onChange={this.handleChange}/>
              <small id="name_help" className="form-text text-muted">Help text placeholder.</small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="font-weight-bold">Description</label>
              <input type="text" className="form-control" id="description" name="description" aria-describedby="description_help" value={group_category.description} placeholder="Enter Description" onChange={this.handleChange}/>
              <small id="description_help" className="form-text text-muted">Help text placeholder.</small>
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
      prevState.group_category = (nextProps.group_category ? this.copy(nextProps.group_category) : this.defaults());
      return prevState;
    })
  }
}

export default GroupCategoryForm;