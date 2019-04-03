import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight, faTrashAlt, faCheck} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faArrowLeft, faArrowRight, faTrashAlt, faCheck )

/**
 * Menu to specify how two people should be merged.
 */
class PeopleMerger extends React.Component {
  static propTypes = {
    /** An array of two people to compare */
    people: PropTypes.array,
    /** Tells parent component to close */
    close: PropTypes.func,
    /** Tells the parent which person was updated and how and which was deleted. */
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.toggleKeep = this.toggleKeep.bind(this);
    this.merge = this.merge.bind(this);
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.renderAssociationRow = this.renderAssociationRow.bind(this);

    this.hiddenAttributes = ["created_at", "updated_at", "id", "person_events", "person_groups", "person_funds"]

    this.state = {
      keep: {}
    }
    Object.keys(this.props.people[0]).forEach(key => this.state.keep[key] = 0);

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }


  /** 
   * Click handler to switch which record is kept and which is deleted.
   * @public
   */
  toggleKeep(attr){
    
    this.setState(prevState => {
      prevState.keep[attr] = (prevState.keep[attr] === 0 ? 1 : 0)

      return prevState;
    });
  }

  /**  
   * Makes server calls to merge the data and then calls the update method passed to it from the parent component.
   * @public
   */
  merge(){
    const p1 = this.props.people[0];
    const p2 = this.props.people[1];
    
    let person_data = {}; 
    Object.keys(p1).forEach(attr => {
      if (!this.hiddenAttributes.includes(attr)){
        person_data[attr] = (this.props.people[this.state.keep[attr]][attr])
      }
    });


    //Move associations records from person2 to person1
    let url = new URL(window.location.origin+"/people/merge_assoc");
    url.searchParams.append("person1", p1.id);
    url.searchParams.append("person2", p2.id);
    fetch(url)
      .then(res => res.json())
      //delete person2
      .then(result => fetch("/people/"+p2.id, {
        method: 'DELETE',
        headers: this.headers,
        credentials: 'include'
      }))
      .then(res => res.json())
      //update person1
      .then(deleted_record => fetch("/people/"+this.props.people[0].id,{
        method: 'PUT',
        body: JSON.stringify(person_data),
        headers: this.headers,
        credentials: 'same-origin'
      }))
      .then(res => res.json())
      .then(updated_record => {
        this.props.merge({updated:[updated_record], deleted:[p2]});
      })
      .catch((error) => {
        this.setState({
          error:error 
        });
      });
  }

  /** 
   * Renders a row containing the specified attribute for both people and buttons to select the one to keep.
   * @public
   */
  renderAttributeRow(attr){
    const p1 = this.props.people[0];
    const p2 = this.props.people[1];

    return (
      <div className="row border-bottom" key={attr}> 
        <div className="col-md-2">
          {this.state.keep[attr] === 0 ? 
            <a className="btn btn-success text-white my-1 mr-2" onClick={() => this.toggleKeep(attr)}>
              <FontAwesomeIcon icon="check"/>
            </a>
            : 
            <a className="btn btn-danger text-white my-1 mr-2" onClick={() => this.toggleKeep(attr)}>
              <FontAwesomeIcon icon="trash-alt"/>
            </a>
          }
          <strong>{attr}:</strong>
        </div>
        
        <div className="col-md-4">
          <p className="m-0" style={{lineHeight:"35px"}}>
            {p1[attr] !== null ? p1[attr].toString() : null}
          </p>
        </div>

        <div className="col-md-2">
          {this.state.keep[attr] === 1 ? 
            <a className="btn btn-success text-white my-1 mr-2" onClick={() => this.toggleKeep(attr)}>
              <FontAwesomeIcon icon="check"/>
            </a>
            : 
            <a className="btn btn-danger text-white my-1 mr-2" onClick={() => this.toggleKeep(attr)}>
              <FontAwesomeIcon icon="trash-alt"/>
            </a>
          }
          <strong>{attr}:</strong>
        </div>

        <div className="col-md-4">
          <p className="m-0" style={{lineHeight:"35px"}}>
            {p2[attr] !== null ? p2[attr].toString() : null}
          </p> 
        </div> 
      </div>
    )
  }

  renderAssociationRow(assoc){
    const p1 = this.props.people[0];
    const p2 = this.props.people[1];

    return (
      <div className="row" key={assoc}> 
        
        <div className="col-md-4 offset-md-2">
          {Object.keys(p1[assoc]).length} {assoc.replace("person_","")}
        </div>

        <div className="col-md-4 offset-md-2">
          {Object.keys(p2[assoc]).length} {assoc.replace("person_","")}
        </div>  
      </div>
    )
  }

  render(){
    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="row justify-content-center">
            <h3 className="card-title">Merging</h3>
          </div>
          <div className="row justify-content-center">
            <p>
              All events, consultations, groups, and funds will be combined into a single new record with duplicates removed.
            </p>
          </div>
          <div className="row justify-content-center">
            <p>
              Select the attributes below to use in the new record.  
            </p>
          </div>

          
          {Object.keys(this.props.people[0]).map(attr => {
            if (this.hiddenAttributes.includes(attr)) return null;
            return this.renderAttributeRow(attr);
          })}

          {["person_events","person_groups","person_funds"].map(assoc => {
            return this.renderAssociationRow(assoc)
          })}

          <button 
            type="button" 
            className="btn btn-secondary text-white mt-3" 
            onClick={this.props.close}
          >
            Cancel
          </button> 
          
          <button 
            type="button" 
            className="btn btn-danger text-white mt-3 float-right" 
            onClick={()=> {
              if (confirm("Are you sure you want to merge these two records?"))
                this.merge();
            }}
          >
            Merge
          </button> 
        </div>
      </div>
    )

  }
}

export default PeopleMerger;