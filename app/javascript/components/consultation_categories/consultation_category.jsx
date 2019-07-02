import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap card showing all the details of a consultation_category and its associated models.
 */
class ConsultationCategory extends React.Component {
  static propTypes = {
    /** The model instance to display */
    consultation_category: PropTypes.object,
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
    let consultation_category = this.props.consultation_category;

    let buttons = (
      <a className="btn btn-secondary text-white" onClick={this.props.close}>Close</a>
    );

    return (
      <div className="card mb-3" id={"consultation_category_"+this.props.consultation_category.id}>
        <div className="card-body">
          <h3 className="card-title">{consultation_category.name}</h3>
          <div className="ml-3">
            {buttons}
            <p><strong>Name: </strong>{consultation_category.name}</p>
              <p><strong>Description: </strong>{consultation_category.description}</p>
            {buttons}
          </div>
        </div>
      </div>
    )   
  }
}

export default ConsultationCategory;