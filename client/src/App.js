import React, { Component } from 'react';
import './App.css';
import Tasks from './tasks/Tasks';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">Welcome</h1>
        </header>
        <Tasks />
      </div>
    );
  }
}

export default App;
