import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faPlus)

import GroupCategorySearch from '../group_categories/group_category_search';
import GroupCategoryForm from '../group_categories/group_category_form';
import GroupSearch from '../groups/group_search';

class GroupForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string,
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    group: PropTypes.object,
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
    parent: PropTypes.object
  };

  static defaultProps = {
    group: {}
  };

  /**
   * The constructor lifecycle method.
   * @param {object} props - The component's props
   * @public
   */
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleParentChange = this.handleParentChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.valid = this.valid.bind(this);
    this.defaults = this.defaults.bind(this);
    this.copy = this.copy.bind(this);

    this.handleGroupCategoryEditToggle = this.handleGroupCategoryEditToggle.bind(this);
    this.handleGroupCategorySelected = this.handleGroupCategorySelected.bind(this);
    this.renderGroupCategorySelector = this.renderGroupCategorySelector.bind(this);

    this.state = {
      group: (this.props.group ? this.copy(this.props.group) : this.defaults()),
      editing_group_category: (this.props.action == "create" ? true : false)
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
      prevState.group[name] = value;
      return prevState;
    });
  }

  handleParentChange(parent){
    this.setState(prevState => {
      prevState.group.parent_id = parent.id;
      prevState.group.parent = parent;

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

    fetch("/groups/"+this.props.group.id, {
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
      fetch('/groups',{
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
      fetch("/groups/"+this.props.group.id,{
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
    let group = this.state.group;
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
      description: "",
      group_category_id: "",
      parent: null,
      parent_id: null
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

  handleGroupCategoryEditToggle(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    this.setState(prevState => {
      prevState.editing_group_category = !prevState.editing_group_category
      return prevState;
    });
  }

  /**
   * Handler invoked by GroupSearch component which sets the associated group id.
   * @param {object} group - A group object
   */
  handleGroupCategorySelected(group_category){
    this.setState(prevState => {
      prevState.group.group_category_id = group_category.id
      prevState.group.group_category = group_category
      prevState.editing_group_category = false
      return prevState;
    });
  }

  renderGroupCategorySelector(){
    return (
      <div className="ml-3">
        {(this.props.action != "create" || this.state.group.group_category_id != "") &&
          <a className="btn btn-sm btn-secondary text-white" role="button" onClick={this.handleGroupCategoryEditToggle} aria-expanded="false" aria-controls="group_category_edit"><FontAwesomeIcon icon="pen"/></a>
        }
        {this.state.editing_group_category &&
          <div id="group_category_edit">
            <GroupCategorySearch handleResultSelected={this.handleGroupCategorySelected} />
            Or create a new one <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#group_category_create" role="button" aria-expanded="false" aria-controls="group_category_create"><FontAwesomeIcon icon="plus"/></a>
            <div className="collapse" id="group_category_create">
              <GroupCategoryForm
                handleUpdate={this.handleGroupCategorySelected}
                action="create"
                current_user={this.props.current_user}
                handleNew={this.handleGroupCategorySelected}
                parent_model="Group"
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

    let group = this.state.group;

    let button_text = null;
    if (this.props.action == "create"){
      button_text = "Create";
    } else if (this.props.action == "update"){
      button_text = "Update";
    }

    let title = null;
    if (this.props.action == "create"){
      title = "Creating A New Group";
    } else if (this.props.action == "update"){
      title = "Editing "+group.name;
    }

    let buttons = (
      <div className="form-actions">
        <a className="btn btn-danger text-white" onClick={this.handleSubmit} disabled={!this.valid()}>{button_text}</a>
        {this.props.action === "update" &&
          <a className="btn btn-danger text-white ml-3" onClick={this.handleDelete} disabled={!this.valid()}>Delete</a>
        }
        {this.props.handleFormToggle !== undefined &&
          <a className="btn btn-danger text-white ml-3" onClick={this.props.handleFormToggle}>Cancel</a>
        }
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
              <input type="text" className="form-control ml-3" id="name" name="name" value={group.name} placeholder="Enter Name" onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <label htmlFor="group_name" className="font-weight-bold">Category</label>
              {group.group_category &&
                <p className="ml-3" id="group_name">{group.group_category.name}</p>
              }

              {this.renderGroupCategorySelector()}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="font-weight-bold">Description</label>
              <input type="text" className="form-control ml-3" id="description" name="description" value={group.description} placeholder="Enter Description" onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <label htmlFor="parent_id" className="font-weight-bold">Parent Group</label>
              <div className="ml-3">
                <p>
                  {this.state.group.parent !== null && this.state.group.parent !== undefined ?
                    this.state.group.parent.name
                    :
                    "This group has no parent group."
                  }
                </p>
                <div className="ml-3">
                  <p> To Change: </p>
                  <GroupSearch
                    name="parent_id"
                    id="parent_id"
                    handleResultSelected={this.handleParentChange}
                  />
                </div>
              </div>
            </div>


            <input type="hidden" className="form-control" id="group_category_id" name="group_category_id" aria-describedby="group_category_id_help" value={group.group_category_id} placeholder="Enter Group Category" onChange={this.handleChange}/>

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
    if (nextProps.group && nextProps.group.id != this.props.group.id)
      this.setState({ group: this.copy(nextProps.group) });
    else if (nextProps.group === undefined)
      this.setState({ group: this.defaults() });
  }
}

export default GroupForm;
