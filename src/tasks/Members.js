import React, { Component } from 'react';

import './Members.css';
import { Button } from '../widgets/Button';
import { NegativeSpace } from '../widgets/NegativeSpace';

export class Members extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }
    
  onClick = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
    console.log("clicked, clickity", this.state.expanded);
  }

  renderMembers() {
    const members = [
      { name: "Person 1" },
      { name: "Person 2" },
      { name: "Person 3" }
    ];
    return (
      <NegativeSpace onClick={ this.onClick }>
        { members.map(({ name }, index) => (
          <div key={ index } className="member">
            <p className="name">{ name }</p>
          </div>
        )) }
      </NegativeSpace>
    );
  }

  render() {
    return (
      <div className="Members">
        { this.state.expanded ?
          <div className="content">
            { this.renderMembers() }
          </div> :
          <Button onClick={ this.onClick }>Members</Button>
        }
      </div>
    );
  }
}
