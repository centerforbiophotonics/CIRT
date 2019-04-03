import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a event_category and its associated models.
 */
class EventCategory extends React.Component {
  static propTypes = {
    /** The model instance to display */
    event_category: PropTypes.object,
    /** @type {object} The attributes of the user who requested the page. */
    current_user: PropTypes.object,
    /** @type {function} A handler to invoke to close/hide the show card. */
    close: PropTypes.func,
  }

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);
  }

  /** 
   * The render lifecycle method.
   * @public
   */
  render(){
    let event_category = this.props.event_category;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"event_category_"+this.props.event_category.id}>
        <div className="card-body">
          <h3 className="card-title">{event_category.name}</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Name: </strong>{event_category.name}</p>
              <p><strong>Description: </strong>{event_category.description}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default EventCategory;