import React, { Component } from 'react';

import './styles/Members.css';
import { Button } from '../widgets/Button';
import { NegativeSpace } from '../widgets/NegativeSpace';

export class Members extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      members: []
    };
  }

  componentDidMount() {
    this.setState({
      members: this.getMembers(),
      expanded: false
    });
  }

  getMembers = () => (
    this.props.teamMembers.map(member => ({
      checked: this.isChecked(member),
      ...member
    }))
  )

  isChecked = ({ name }) =>
    !!this.props.assignedMembers.find(assignedMember =>
      assignedMember.name === name)

  onClick = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
    console.log("clicked, clickity", this.state.expanded);
  }

  onClickMember = index => {
    const member = this.state.members[index];
    member.checked = !member.checked;
    const updatedState = {
      members: this.state.members
    };
    this.setState(updatedState);
    this.props.onUpdated(updatedState.members);
  }

  renderMembers() {
    return (
      <NegativeSpace onClick={ this.onClick }>
        { this.state.members.map(({ name, checked }, index) => (
          <p
            key={ index }
            className="member"
            onClick={ () => this.onClickMember(index) }
          >
            <span className={ "check-area" + (checked ? " checked" : "") }></span>
            { " " }
            <span className="name">{ name }</span>
          </p>
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
