import React from 'react';
import PropTypes from 'prop-types';
import CSVReader from 'react-csv-reader';
import Select from 'react-select';

/**
 * Menu for importing people from CSV.
 */
class PeopleImport extends React.Component {
  static propTypes = {
    /** A hash of all people in the database. */
    people: PropTypes.object,
    /** Tells parent component to close */
    close: PropTypes.func
    /** Tells the parent which person was updated and how and which was deleted. */
  };

  /** 
   * The constructor lifecycle method. 
   * @param {object} props - The component's props 
   * @public
   */
  constructor(props){
    super(props);

    this.onFileLoaded = this.onFileLoaded.bind(this);

    this.updateAttributeMap = this.updateAttributeMap.bind(this);
    this.confirmAttributeMap = this.confirmAttributeMap.bind(this);
    this.renderAttributeMap = this.renderAttributeMap.bind(this);

    this.renderVirtualPeople = this.renderVirtualPeople.bind(this);

    this.hiddenAttributes = ["created_at", "updated_at", "id", "person_events", "person_groups", "person_funds"]

    this.associationAttributes = {
      event: ["name", "description"],
      group: ["name", "description"],
      fund: ["name", "description", "amount", "date"]
    }

    this.attributes = Object.keys(
      this.props.people[Object.keys(this.props.people)[0]]
    ).filter(a => (!this.hiddenAttributes.includes(a)));

    this.selectValues = [{value:"Ignore", label:"Ignore"}].concat(this.attributes.map(a => ({value: a, label: a})));
    for (let assoc in this.associationAttributes){
      this.associationAttributes[assoc].forEach(a_attr => {
        let new_option = assoc+"-"+a_attr;
        this.selectValues.push({value: new_option, label:new_option})
      })
    }

    this.state = {
      file_data:[],
      attribute_map:{},
      attribute_map_confirmed:false,
      virtual_people: [],
      virtual_people_discrepancies: [],
      virtual_people_confirmed:false,
      plan: {
        creating: {people: [], confirmed: false},
        updating: {people: [], confirmed: false}
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

  onFileLoaded(csv_matrix){
    //convert to array of objects and setState
    let csv_objs = [];
    let attribute_map = {};


    let headers = csv_matrix[0];

    headers.forEach((header,col) => {
      attribute_map[header] = this.attributes.find(attr => {
        let snaked_header = header.toLowerCase().replace(" ","_");
        return attr === snaked_header;
      });
    });
    
    for (let row = 1; row < csv_matrix.length; row++){
      let new_obj = {};
      headers.forEach((header,col) => {
        new_obj[header] = csv_matrix[row][col]
      });
      csv_objs.push(new_obj);
    }

    this.setState({
      file_data: csv_objs, 
      attribute_map: attribute_map, 
      virtual_people: [],
      virtual_people_discrepancies: [],
      plan: {
        creating: {people: [], confirmed: false},
        updating: {people: [], confirmed: false}
      },
      results: []
    });
  }

  

  updateAttributeMap(column, attribute){
    this.setState(prevState => {
      prevState.attribute_map[column] = (attribute === "Ignore" ? undefined : attribute);
      return prevState;
    });
  }

  confirmAttributeMap(){
    this.setState(prevState =>{
      let a_map = prevState.attribute_map;

      prevState.attribute_map_confirmed = !prevState.attribute_map_confirmed;

      if (prevState.attribute_map_confirmed){
        prevState.virtual_people = prevState.file_data.map(row => {
          let new_person = {};
          for (let column in a_map){
            if (a_map[column] != undefined){
              new_person[a_map[column]] = row[column]
            }
          }

          return {
            person: new_person,
            resolved: false,
            matches: []
          };
        });

        //Detect internal discrepancies in file and add them to state for the virtual people renderer

      }
      return prevState;
    });
  }

  comparePeople(p1, p2){
    const lcName1 = p1.name.toLowerCase();
    const lcName2 = p2.name.toLowerCase();

    const lcEmail1 = p1.email.toLowerCase();
    const lcEmail2 = p2.email.toLowerCase();

    if (
      lcName1 === lcName2 ||
      lcEmail1 === lcEmail2 ||
      this.characterDiff(lcName1, lcName2) === 1 ||
      this.characterDiff(lcEmail1, lcEmail2) === 1 
    ){
      return true;
    }

    return false;
  }

  renderAttributeMap(){
    return (
      <div className="form-group">
        <h4>Step 2</h4>


        <div className="ml-3">
          <p>Map columns from the file to person or related record attributes.</p>
          <p>You must select columns for name and email to create new people.</p>

          {Object.keys(this.state.attribute_map).length > 0 &&
            <div className="row">
              <div className="col-md-3">
                <h5>File Column</h5>
              </div>
              <div className="col-md-3">
                <h5>Person or Related Record Attribute</h5>
              </div>
            </div>
          }

          {Object.keys(this.state.attribute_map).map((column, i) => {
            const attribute = this.state.attribute_map[column];
            const selectedValue = (attribute === undefined ?
              {value: "Ignore", label: "Ignore"}
              :
              {value: attribute, label: attribute}
            );

            return (
              <div className={"row p-1 "+(i%2===0?"even":"odd")}  key={column}>
                <div className="col-md-3">
                  <strong >{column}</strong>
                </div>

                <div className="col-md-3">
                  <Select
                    value={selectedValue}
                    onChange={(selected) => {
                      this.updateAttributeMap(column, selected.value);
                    }}
                    options={this.selectValues}
                  />
                </div>
              </div>
            );
          })}

          <button 
            type="button" 
            className="btn btn-secondary text-white mt-3" 
            onClick={this.confirmAttributeMap}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  updateVirtualPeople(){
    //Take one new virtual person and replace two
    //If no virtual people discrepancies remain calculate matches
    
  }

  renderVirtualPeople(){
    //Display virtual people pairs with discrepancies for user to resolve
    return (
      <div className="form-group">
        <h4>Step 3</h4>

        <div className="ml-3">
          <p>The following people records were obtained from the file you selected.</p>
          <p>Any discepancies within the file are shown below. If there are none or you have resolved them, press the confirm button to continue.</p>

          {this.state.virtual_people.toString()}
        </div>
      </div>
    );
  }

  confirmVirtualPeople(){

  }

  confirmCreatePlan(){
    //copy all virtual people with matches.length == 0 and into plan.creating.people and mark them resolved in virtual people
  }

  renderCreatePlan(){
    //Display table of all virtual people with matches.length == 0
    //Ask user review creations and confirm
  }

  updateUpdatePlan(){
    //for each in an array of pairs of a real and virtual person
      //copy a real person with attributes updated from a virtual person into plan.updating.people
      //mark that virtual person resolved
  }

  renderUpdatePlan(){
    //Display all unresolved people virtual people with exact matches (only new data is added nothing non-null changed)
    //Ask for confirmation then send all as array to updateUpdatePlan

    //Display virtual people with matches
    //If unresolved show button to merge with a match and updateUpdatePlan (maybe option to ignore)
    //If resolved show a checkmark and a way to unresolve
  }

  runImport(){
    //Run AJAX calls sequentially and display and update results.
  }

  render(){
    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="row justify-content-center">
            <h3 className="card-title">Importing</h3>
          </div>

          <div className="form-group">
            <h4>Step 1</h4>
            <div className="ml-3">
              <CSVReader
                label=""
                onFileLoaded={this.onFileLoaded}
              />
            </div>
          </div>

          {this.renderAttributeMap()}

          {this.state.attribute_map_confirmed &&
            this.renderVirtualPeople()
          }

          {//If all virtual people are resolved then show a button to trigger runImport
          }

          {//If results not empty show them
          }

          <button 
            type="button" 
            className="btn btn-secondary text-white mt-3" 
            onClick={this.props.close}
          >
            Cancel
          </button> 
        </div>
      </div>
    );
  }


}

export default PeopleImport;