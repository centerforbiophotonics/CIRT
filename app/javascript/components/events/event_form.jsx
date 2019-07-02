import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

// import { WithContext as ReactTags } from 'react-tag-input';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faPen, faPlus)

import EventCategorySearch from '../event_categories/event_category_search';
import EventCategoryForm from '../event_categories/event_category_form';


class EventForm extends React.Component {
  static propTypes = {
    /** @type {string} A string to indicate if the form is being used to update or create a model instance. Must be equal to "update" or "create". */
    action: PropTypes.string,
    /** @type {string} The record to edit. If creating a new instance this prop is not required and the new instance will be created using defaults returned from the defaults method. */
    event: PropTypes.object,
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
    event: {}
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

    this.handleEventCategoryEditToggle = this.handleEventCategoryEditToggle.bind(this);
    this.handleEventCategorySelected = this.handleEventCategorySelected.bind(this);
    this.renderEventCategorySelector = this.renderEventCategorySelector.bind(this);

    this.handleTagDelete = this.handleTagDelete.bind(this);
    this.handleTagAddition = this.handleTagAddition.bind(this);
    this.handleTagDrag = this.handleTagDrag.bind(this);

    this.state = {
      event: this.copy(this.props.event),
      editing_event_category: (this.props.action == "create" ? true : false)
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

    const name = (e._isAMomentObject ? "date" : e.target.name);
    const value = (e._isAMomentObject ? e : e.target.value);;

    this.setState(prevState => {
      prevState.event[name] = value;
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

    fetch("/events/"+this.props.event.id, {
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
      fetch('/events',{
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
      fetch("/events/"+this.props.event.id,{
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
    let event = this.state.event;
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
      date: moment(),
      event_category_id: "",
      tags: []
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

    copiedObj.date = moment(copiedObj.date, "YYYY-MM-DD")
    return copiedObj;
  }

  handleEventCategoryEditToggle(e){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() == false)
      e.preventDefault();

    this.setState(prevState => {
      prevState.editing_event_category = !prevState.editing_event_category
      return prevState;
    });
  }

  /**
   * Handler invoked by EventSearch component which sets the associated event id.
   * @param {object} event - A event object
   */
  handleEventCategorySelected(event_category){
    this.setState(prevState => {
      prevState.event.event_category_id = event_category.id
      prevState.event.event_category = event_category
      prevState.editing_event_category = false
      return prevState;
    });
  }

  handleTagDelete(i) {
    this.setState(prevState => {
      prevState.event.tags = prevState.event.tags.filter((tag, index) => index !== i);
      return prevState;
    });
  }

  handleTagAddition(tag) {
    this.setState(prevState => {
      prevState.event.tags.push(tag.text);
      return prevState;
    });
  }

  handleTagDrag(tag, currPos, newPos) {
    this.setState(prevState => {
      const tags = [...prevState.event.tags];
      const newTags = tags.slice();

      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag.text);

      prevState.event.tags = newTags;

      return prevState;
    });
  }

  renderEventCategorySelector(){
    return (
      <div className="ml-3">
        {(this.props.action != "create" || this.state.event.event_category_id != "") &&
          <a className="btn btn-sm btn-secondary text-white" role="button" onClick={this.handleEventCategoryEditToggle} aria-expanded="false" aria-controls="event_category_edit"><FontAwesomeIcon icon="pen"/></a>
        }
        {this.state.editing_event_category &&
          <div id="event_category_edit">
            <EventCategorySearch handleResultSelected={this.handleEventCategorySelected} />
            Or create a new one <a className="btn btn-sm btn-secondary text-white" data-toggle="collapse" href="#event_category_create" role="button" aria-expanded="false" aria-controls="event_category_create"><FontAwesomeIcon icon="plus"/></a>
            <div className="collapse" id="event_category_create">
              <EventCategoryForm
                handleUpdate={this.handleEventCategorySelected}
                action="create"
                current_user={this.props.current_user}
                handleNew={this.handleEventCategorySelected}
                parent_model="Event"
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

    let event = this.state.event;
    let action = this.props.action;

    let button_text = null;
    if (action == "create"){
      button_text = "Create";
    } else if (action == "update"){
      button_text = "Update";
    }

    let title = null;
    if (action == "create"){
      title = "Creating A New Event";
    } else if (action == "update"){
      title = "Editing " + event.name;
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
              <input type="text" className="form-control" id="name" name="name" aria-describedby="name_help" value={event.name} placeholder="Enter Name" onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <label htmlFor="event_name" className="font-weight-bold">Category</label>
              {event.event_category &&
                <p className="ml-3" id="event_name">{event.event_category.name}</p>
              }

              {this.renderEventCategorySelector()}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="font-weight-bold">Description</label>
              <input type="text" className="form-control" id="description" name="description" aria-describedby="description_help" value={event.description} placeholder="Enter Description" onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <label htmlFor="date" className="font-weight-bold">Date</label>
              <DatePicker
                showTimeSelect
                id="date"
                selected={event.date}
                onChange={this.handleChange}
              />
            </div>


            <div className="form-group">
              <label htmlFor="tags" className="font-weight-bold">Tags</label>
              <ReactTags
                id="tags"
                tags={event.tags.map(t => ({id: t, text:t}))}
                handleDelete={this.handleTagDelete}
                handleAddition={this.handleTagAddition}
                handleDrag={this.handleTagDrag}
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
      prevState.event = (nextProps.event ? this.copy(nextProps.event) : this.defaults());
      return prevState;
    })
  }
}

export default EventForm;
