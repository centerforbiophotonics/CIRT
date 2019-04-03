import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCompress } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add( faCompress )

import PeopleMerger from './people_merger';
import PersonSearch from './person_search';

import {characterDiff, personCapitalizationProblem} from '../lib/util'

/**
 * Bootstrap card showing all the details of a person and its associated models.
 */
class PeopleCleaner extends React.Component {
  static propTypes = {
    /** The people to compare */
    people: PropTypes.object,
    /** Tells parent component to close */
    close: PropTypes.func,
    /** Tells parent about people that have been updated and deleted. */
    merge: PropTypes.func,
    /** Whether this component will make server calls to update data for just return changes. */
    makeServerCalls: PropTypes.bool
  };

  static defaultProps = {
    makeServerCalls: false
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.toggleMerging = this.toggleMerging.bind(this);
    this.columnDefs = this.columnDefs.bind(this);
    this.setViewing = this.setViewing.bind(this);
    this.setDupCriteria = this.setDupCriteria.bind(this);
    this.detectDuplicates = this.detectDuplicates.bind(this);
    this.detectWhitespace = this.detectWhitespace.bind(this);
    this.fixWhitespace = this.fixWhitespace.bind(this);
    this.detectCapitalization = this.detectCapitalization.bind(this);
    this.fixCapitalization = this.fixCapitalization.bind(this);

    this.setManualDups = this.setManualDups.bind(this);

    this.hiddenAttributes = ["created_at", "updated_at", "id", "person_events", "person_groups", "person_funds"];

    this.state = {
      merging:false,
      selected: null,
      viewing: "whitespace",
      duplicate_criteria:{
        exact:false,
        one_char:false,
        switched:false
      },
      manual_dups:[null, null],
      cap_criteria: {
        lc_name_parts: ["de", "del", "la", "van", "den"]
      },
      problems:{
        whitespace:this.detectWhitespace(),
        capitalization:[],
        duplicates:{}
      }
    }

    this.token = document.head.querySelector("[name=csrf-token]").content;
    this.headers = {
      'Content-Type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.token
    };
  }

  setDupCriteria(criteria){
    this.setState(prevState => {
      prevState.duplicate_criteria[criteria] = !prevState.duplicate_criteria[criteria];
      prevState.problems.duplicates = this.detectDuplicates();
      return prevState;
    })
  }

  setManualDups(i, p_id){
    this.setState(prevState => {
      prevState.manual_dups[i] = this.props.people[p_id];
      return prevState;
    })
  }

  setViewing(problem){
    let call = {
      duplicates: this.detectDuplicates,
      whitespace: this.detectWhitespace,
      capitalization: this.detectCapitalization
    }

    this.setState(prevState => {
      prevState.viewing = problem;
      prevState.problems[problem] = call[problem]();
      return prevState;
    });
  }

  detectDuplicates(){
    let duplicates = {};

    const people = Object.values(this.props.people);
    const criteria = this.state.duplicate_criteria;

    if (Object.values(this.state.duplicate_criteria).includes(true)){
      for (let indx1 = 0; indx1 < people.length ;indx1++){
        for (let indx2 = indx1+1; indx2 < people.length; indx2++){          
          const p1 = people[indx1];
          const p2 = people[indx2];
          const key = [p1.id, p2.id].sort().join("-");
          
          const lcName1 = p1.name.toLowerCase().trim();
          const lcName2 = p2.name.toLowerCase().trim();

          const lcEmail1 = p1.email.toLowerCase();
          const lcEmail2 = p2.email.toLowerCase();

          
          const nameParts1 = lcName1.split(" ");
          const nameParts2 = lcName2.split(" ");

          const partsSwitched = (
            nameParts1[0] == nameParts2[nameParts2.length-1] && 
            nameParts2[0] == nameParts1[nameParts1.length-1]
          );

          if (
            (
              (criteria.exact && (lcName1 === lcName2 || lcEmail1 === lcEmail2)) ||
              (criteria.one_char && (characterDiff(lcName1, lcName2) === 1 || characterDiff(lcEmail1, lcEmail2) === 1)) ||
              (criteria.switched && partsSwitched)
            ) && !duplicates.hasOwnProperty(key)
          ){
            duplicates[key] = {person1:p1, person2:p2};
          }
        }
      }
    }

    return duplicates;
  }

  detectLackOfIds(){

  }

  detectWhitespace(){
    let whitespace = [];

    const people = Object.values(this.props.people);

    people.forEach(p => {
      if (
        p.name.trim() !== p.name || 
        p.email.trim() !== p.email ||
        p.name.includes("  ") ||
        p.email.includes("  ")
      ){
        whitespace.push(p); 
      }
    });

    return whitespace;
  }

  fixWhitespace(i){
    let whitespace = this.state.problems.whitespace;

    if (i >= whitespace.length){
      this.props.merge({updated:whitespace, deleted:[]})
    } else {
      let p = whitespace[i];
      let person_data = {}; 
      Object.keys(p).forEach(attr => {
        if (!this.hiddenAttributes.includes(attr)){
          person_data[attr] = p[attr];
        }
      });
      person_data.name = person_data.name.trim();
      while(person_data.name.includes("  ")){
         person_data.name = person_data.name.replace("  "," ")
      }
     
      person_data.email = person_data.email.trim();
      while(person_data.email.includes("  ")){
         person_data.email = person_data.email.replace("  "," ")
      }

      fetch("/people/"+p.id,{
        method: 'PUT',
        body: JSON.stringify(person_data),
        headers: this.headers,
        credentials: 'same-origin'
      }).then(res => res.json())
      .then(updated_record => {
        this.setState(prevState => {
          prevState.problems.whitespace[i] = updated_record;
          return prevState;
        }, () => {this.fixWhitespace(i+1)})
      });
    }
  }

  detectCapitalization(){
    let problems = [];
    Object.values(this.props.people).forEach(p => {
      let name_cap = false;
      p.name.split(" ").forEach(name_part => {
        if (
          name_part[0].toUpperCase() != name_part[0] &&
          !this.state.cap_criteria.lc_name_parts.includes(name_part)
          // ||
          // name_part.slice(1).toLowerCase() != name_part.slice(1)
        ) name_cap = true;

        if (p.name.toUpperCase() === p.name) 
          name_cap = true;  
      })

      if (
          (p.email != null && p.email.toLowerCase() !== p.email) || 
          (p.cas_user != null && p.cas_user.toLowerCase() !== p.cas_user) ||
          name_cap
      ){
        problems.push(p); 
      }
    });
    return problems;
  }

  fixCapitalization(i){
    let capitalization = this.state.problems.capitalization;

    if (i >= capitalization.length){
      this.props.merge({updated:capitalization, deleted:[]})
    } else {
      let p = capitalization[i];
      let person_data = {}; 
      Object.keys(p).forEach(attr => {
        if (!this.hiddenAttributes.includes(attr)){
          person_data[attr] = p[attr];
        }
      });

      person_data.name = person_data.name.split(" ").map(name_part => {
        return (
          !["de", "del", "la"].includes(name_part) ?
            name_part[0].toUpperCase() + name_part.slice(1).toLowerCase()
            :
            name_part
        )
      }).join(" ");

      if (person_data.cas_user != null)
        person_data.cas_user = person_data.cas_user.toLowerCase();

      if (person_data.email != null)
        person_data.email = person_data.email.toLowerCase();

      fetch("/people/"+p.id,{
        method: 'PUT',
        body: JSON.stringify(person_data),
        headers: this.headers,
        credentials: 'same-origin'
      }).then(res => res.json())
      .then(updated_record => {
        this.setState(prevState => {
          prevState.problems.capitalization[i] = updated_record;
          return prevState;
        }, () => {this.fixCapitalization(i+1)})
      });
    }
  }


  /** 
   * Click handler that toggles merge menu for a pair of people. 
   * @public
   */
  toggleMerging(e,d){
    if (e.isDefaultPrevented != null && e.isDefaultPrevented() === false)
      e.preventDefault();

    console.log(d);

    this.setState(prevState => ({
      selected: (d === undefined ? null : d),
      merging: (d === undefined ? false : true),
    }));
  }

  /**
   * An organizing function that returns the column definition options use by react table.
   * @return {object} Options to be passed to react table @link https://react-table.js.org/#/story/readme
   * @public
   */
  columnDefs(){
    return [
      { Header: 'Person 1',
        accessor: 'person1',
        Cell: d => {
          return (
            <div>
              [{d.value.id}] {d.value.name} ({d.value.email})            
            </div>
          )
        }
      },
      { Header: 'Person 2',
        accessor: 'person2',
        Cell: d => {
          return (
            <div>
              [{d.value.id}] {d.value.name} ({d.value.email})            
            </div>
          )
        }
      },
      { 
        Header: 'Actions',
        Cell: d => {
          return (
            <div>
              <a className="btn btn-sm btn-secondary text-white" onClick={(e)=>{this.toggleMerging(e,Object.values(d.original))}}>
                Define Merge
              </a>
            </div>
          )
        },
        className: "text-center",
        sortable: false,
        resizable: false,
        filterable: false,
        width: 160
      }
    ];
  }

  render(){
    let problems = this.state.problems;

    return (   
      this.state.merging ?
        <PeopleMerger
          people={this.state.selected}
          close={this.toggleMerging}
          merge={this.props.merge}
        />
        :
        <div className="card mb-3">
          <div className="card-body">
            <ul className="nav justify-content-center">              
              {Object.keys(problems).map(problem => (
                <li className="nav-item" key={problem}>
                  <a 
                    className={
                      "nav-link btn text-white mr-1 "+
                      (this.state.viewing === problem ? "btn-primary" : "btn-secondary")
                    }
                    onClick={() => this.setViewing(problem)}
                  >{problem.charAt(0).toUpperCase() + problem.slice(1)}</a>
                </li>
              ))}
            </ul>
                    
            {
              this.state.viewing === "duplicates" ?
                <div>
                  <h3 className="card-title">
                    Merge Duplicate Records
                  </h3>

                  <h4>Manual Select:</h4>

                  <div className="d-inline-block ml-5">
                    <label htmlFor="manual_person_1">Person 1:</label>
                    {this.state.manual_dups[0] === null ?
                      <b>No One Selected</b>
                      :
                      <b>{this.state.manual_dups[0].name} ({this.state.manual_dups[0].id})</b>
                    }
                    <PersonSearch id="manual_person_1" handleResultSelected={(p) => {this.setManualDups(0, p.id)}} />

                    <label htmlFor="manual_person_2">Person 2:</label>
                    {this.state.manual_dups[1] === null ?
                      <b>No One Selected</b>
                      :
                      <b>{this.state.manual_dups[1].name} ({this.state.manual_dups[1].id})</b>
                    }
                    <PersonSearch id="manual_person_2" handleResultSelected={(p) => {this.setManualDups(1, p.id)}} />
                  
                    {(this.state.manual_dups[0] != null && this.state.manual_dups[1] != null) &&
                      <a className="btn btn-sm btn-secondary text-white" onClick={(e)=>{this.toggleMerging(e,this.state.manual_dups)}}>
                        Define Merge
                      </a>
                    }
                  </div>




                  <h4>Automatic Detection:</h4>
                  
                  <div className="ml-5">
                    <p>
                      Criteria (select at least one to begin):
                    </p>
                    
                    <div className="d-inline-block ml-5">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="criteria_exact" 
                        checked={this.state.duplicate_criteria.exact}
                        onChange={() => this.setDupCriteria("exact")}
                      />
                      <label htmlFor="criteria_exact">Exact Match</label>
                    </div>

                    <div className="d-inline-block ml-5">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="criteria_one_char" 
                        checked={this.state.duplicate_criteria.one_char}
                        onChange={() => this.setDupCriteria("one_char")}
                      />
                      <label htmlFor="criteria_one_char">One Character Difference</label>
                    </div>

                    <div className="d-inline-block ml-5">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="criteria_switched" 
                        checked={this.state.duplicate_criteria.switched}
                        onChange={() => this.setDupCriteria("switched")}
                      />
                      <label htmlFor="criteria_switched">Switched First and Last Name</label>
                    </div>

                    <p>
                      Potential Duplicate Records: {Object.keys(problems.duplicates).length}
                    </p>

                    {Object.values(problems.duplicates).length > 0 &&
                      <ReactTable
                        data={Object.values(problems.duplicates)}
                        columns={this.columnDefs()}
                        filterable
                        defaultPageSize={10}
                        minRows={0} 
                      />
                    }
                    
                  </div>
                  
                </div>
              : this.state.viewing === "whitespace" ?
                <div>
                  <h3 className="card-title">
                    People With Extra Whitespace In Their Name or Email 
                    ({Object.keys(problems.whitespace).length})
                    </h3>
                  
                  <ul>
                    {problems.whitespace.map(p => {
                      return (
                        <li key={p.id}>
                          <pre>"{p.name}" -- "{p.email}"</pre>
                        </li>
                      )
                    })}
                  </ul>
                  {problems.whitespace.length > 0 &&
                    <button type="button" className="btn btn-secondary text-white mt-3" onClick={() => this.fixWhitespace(0)}>Fix</button>
                  }
                </div>
              : this.state.viewing === "capitalization" ?
                <div>
                  <h3 className="card-title">
                    People With Uppercase Characters In Their CAS User Name or Email or Non-Standard Name Capitalization
                    ({Object.keys(problems.capitalization).length})
                  </h3>
                  
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">CAS User Name</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problems.capitalization.map(p => {
                        return (
                          <tr key={p.id}>
                            <td><pre>"{p.name}"</pre></td>
                            <td><pre>"{p.cas_user}"</pre></td>
                            <td><pre>"{p.email}"</pre></td>
                          </tr>
                        )
                      })}
                    </tbody> 
                  </table>
                  {problems.capitalization.length > 0 &&
                    <button type="button" className="btn btn-secondary text-white mt-3" onClick={() => this.fixCapitalization(0)}>Fix</button>
                  }  
                </div>
              : null
            }
            <button type="button" className="btn btn-danger text-white mt-3" onClick={this.props.close}>Close</button> 
          </div>
        </div>
    )
  }
}

export default PeopleCleaner;
