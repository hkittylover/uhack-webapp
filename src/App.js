import React, { Component } from 'react';
import logo from './medicall_white.png';
import load from './load.gif';
import './App.css';
import firebase from './firebase.js';
import { firestore } from 'firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {hospitals:[], terminals:[], requests:[], responses:[], users:[], onCall: false, reqid: -1, exloc:"",patient:"",condition:""};
    this.choose = this.choose.bind(this);
    this.hasRequest = this.hasRequest.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.hospitalRef = firebase.database().ref('hospital');
    this.hospitalCallback = this.hospitalRef.on('value', (snapshot) => {
      let items = snapshot.val();
      this.setState({
        ... this.state, 
        hospitals: items,
      });
    });
    this.terminalRef = firebase.database().ref('terminal');
    this.terminalCallback = this.terminalRef.on('value', (snapshot) => {
      let items = snapshot.val();
      this.setState({
        ... this.state, 
        terminals: items,
      });
    });
    this.requestRef = firebase.database().ref('request');
    this.requestCallback = this.requestRef.on('value', (snapshot) => {
      let items = snapshot.val();
      this.setState({
        ... this.state, 
        requests: items,
      });
    });
    this.responseRef = firebase.database().ref('response');
    this.responseCallback = this.responseRef.on('value', (snapshot) => {
      let items = snapshot.val();
      this.setState({
        ... this.state, 
        responses: items,
      });
    });
    this.userRef = firebase.database().ref('allusers');
    this.userCallback = this.userRef.on('value', (snapshot) => {
      let items = snapshot.val();
      this.setState({
        ... this.state, 
        users: items,
      });
    });
  }

  componentWillUnmount() {
    // Un-register the listener on '/todoList'.
    this.hospitalRef.off('value', this.hospitalCallback);
    this.terminalRef.off('value', this.terminalCallback);
    this.requestRef.off('value', this.requestCallback);
    this.responseRef.off('value', this.responseCallback);
    this.userRef.off('value', this.userCallback);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  hasRequest() {
    if(this.state.requests != null && this.state.requests.length !== 0) {
      return true;
    }
    return false;
  }

  choose() {
    if(this.state.onCall) {
      return (null);
    } else if(this.hasRequest()){
      this.state.reqid = Object.keys(this.state.requests)[0];
      var req = this.state.requests[this.state.reqid];
      var userL = this.state.users;
      var user = "";
      console.log(userL);
      if(userL != null && userL.length !== 0) {
        user = this.state.users[req.user].name;
      }
      // this.state.onCall = true;
      return (
        <div className="App">
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          </header>
          <div class="text-container">
          <div className="text-body text-title">
            <h1 >Ambulance Request</h1>
            <i>Requested by: <b>{user}</b></i></div>
            <form onSubmit={this.handleSubmit}>
            <div className="text-body text-form">
              <div className="form-text">Patient's name</div><br/> <input className="text-input-area  patient-name" name="patient" value={this.state.patient} onChange={this.handleChange}/><br/><br/>
              <div className="form-text">Exact location</div><br/> <textarea className="text-input-area" name="exloc" value={this.state.exloc} onChange={this.handleChange}/><br/><br/>
              <div className="form-text">Current condition</div><br/><textarea className="text-input-area" name="condition" value={this.state.condition} onChange={this.handleChange}/><br/><br/>
              <input className="button-submit" type="submit" value="Dispatch Ambulance"/>
            </div>
            </form>
            </div>
        </div>
      );
    } else {
      return (
      <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          </header>
        <h1>Waiting for request...</h1>
        <img src={load} className="App-logo" alt="logo" />
      </div>
    );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var req = this.state.requests[this.state.reqid];
    req = {...req, exloc: this.state.exloc, patient: this.state.patient, condition: this.state.condition, ambulance: this.state.terminals.terminal1[Object.keys(this.state.terminals.terminal1)[0]], hospital: this.state.hospitals[Object.keys(this.state.hospitals)[0]]};
    // console.log(req);
    this.responseRef.update({
      [this.state.reqid]:req
    });
    this.requestRef.child(this.state.reqid).remove();
    this.reqid = -1;
    this.setState({
      ...this.state,
        exloc:"",
        patient:"",
        condition:"",
        requests:[]
    });
    this.forceUpdate();
  }

  render() {
    console.log(this.state);
    var code = this.choose();
    return code;

    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h1 className="App-title">Welcome to React</h1>
    //     </header>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     {this.items}
    //   </div>
    // );
  }
}

export default App;
