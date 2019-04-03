import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight, faTrashAlt, faCheck} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add( faArrowLeft, faArrowRight, faTrashAlt, faCheck );

import Select from 'react-select';
/**
 * Menu to specify how two people should be merged.
 */
class RoleMerger extends React.Component {
  static propTypes = {
    /** A hash of all role records */
    roles: PropTypes.object,
    /** Tells parent component to close */
    close: PropTypes.func,
    /** Tells the parent which person was updated */
    update: PropTypes.func
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.setPrimaryId = this.setPrimaryId.bind(this);
    this.setVariantIds = this.setVariantIds.bind(this);
    this.merge = this.merge.bind(this);
   
    this.state = {
      primary_id: null,
      children_ids: []
    }

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }

  setPrimaryId(id){
    this.setState({primary_id: (id === undefined ? null : id)})
  }

  setVariantIds(ids){
    this.setState({children_ids: ids})
  }


  /**  
   * Makes server calls to merge the data and then calls the update method passed to it from the parent component.
   * @public
   */
  merge(){

    //Move associations records from person2 to person1

    fetch("/roles/"+this.state.primary_id,{
        method: 'PUT',
        body: JSON.stringify({role: {children: this.state.children_ids}}),
        headers: this.headers,
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(updated_record => {
        this.props.update(updated_record);
      })
      .catch((error) => {
        this.setState({
          error:error 
        });
      });
  }



  render(){
    const p_id = this.state.primary_id;

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="row justify-content-center">
            <h3 className="card-title">Merging</h3>
          </div>

          <p>
            Select a role that best describes the collection of roles you want to merge. You might need to create a new one.
          </p>
          <Select
            id="primary_role"
            value={
              p_id !== null ?
                {value: p_id, label: this.props.roles[p_id].name}
                :
                null
            }
            onChange={o => {this.setPrimaryId(o.value)}}
            options={Object.values(this.props.roles).map(r => ({value: r.id, label:r.name}))}
          />

          {p_id !== null && this.props.roles[p_id].children.length > 0 &&
            <div>
              <p>This role already has the following variants/children:</p>
              <ul>
                {this.props.roles[p_id].children.map(c => 
                  <li key={c.id}>{c.name}</li>
                )}
              </ul>
            </div>
          }

          {p_id !== null && this.props.roles[p_id].parent != undefined && 

            this.props.roles[p_id].parent.toString()
          }

          
          <p className="mt-5">
            Select one or more other roles that will be added as variants/children of the role selected above. 
            Roles can only have one parent.
            If a role selected below already has a parent it will be changed to the role selected above.
          </p>
          <Select
            id="children_roles"
            value={
              this.state.children_ids.map(vid => ({value: vid, label: this.props.roles[vid].name}))
            }
            onChange={vals => {this.setVariantIds(vals.map(val => val.value))}}
            options={Object.values(this.props.roles).map(r => ({value: r.id, label:r.name}))}
            isMulti={true}
          />  

          {this.state.children_ids.includes(this.state.primary_id) &&
            <div className="alert alert-danger mt-3" role="alert">
              You can't select the same role in both selectors.
            </div>
          }        

          {this.state.children_ids.
            filter(c_id => {
              let c = this.props.roles[c_id];
              console.log(c_id);
              console.log(c);
              return c.parent !== undefined && p_id !== null && c.parent.id != p_id
            }).
            map(c_id => {
              let c = this.props.roles[c_id];
              return (
                <div key={c_id} className="alert alert-warning mt-3" role="alert">
                  {c.name} already has the parent role: {c.parent.name}
                </div>
              );
            })
          }
          

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
              if (
                confirm(
                  "Are you sure you want to remove "+
                  this.state.children_ids.length+
                  " roles and add them as variants/children of "+
                  this.props.roles[this.state.primary_id].name+
                  "?")
              )
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

export default RoleMerger;