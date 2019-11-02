import React, { Component } from 'react';

import './TaskCard.css';
import { Button } from '../widgets/Button';
import { Members } from './Members';

export class TaskCard extends Component {
  constructor() {
    super();
    this.state = {
      task: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.task === null) {
      this.setState({ task: null });
    } else if (this.state.task === null) {
      this.setState({
        task: nextProps.task
      });
    }
  }

  onMembersUpdated = members => {
    const filteredMembers = members
      .filter(member => member.checked)
      .map(({ name }) => ({ name }));
    this.setState(state => ({
      task: {
        ...state.task,
        members: filteredMembers
      }
    }));
  }

  render() {
    const hidden = this.props.task === null;
    return (
      <div className={ "TaskCard" + (hidden ? " hidden" : "") }>
        <div
          onClick={ this.props.onClose }
          className={ "background" }
        />
        <div className="container">
          { !hidden && (
            <div className="content">
              <div className="top-div">
                <div>
                  { this.props.task.title}
                  { this.props.task.description }
                </div>
                <div className="action-bar">
                  <Members
                    assignedMembers={ this.props.task.members }
                    teamMembers={ this.props.teamMembers }
                    onUpdated={ this.onMembersUpdated }
                  />
                </div>
              </div>
              <div className="button-bar">
                <Button
                  onClick={ () => this.props.onDelete(this.state.task) }
                >Delete</Button>
                <Button
                  onClick={ () => this.props.onSave(this.state.task) }
                >Save</Button>
              </div>
            </div>
          ) }
          </div>
      </div>
    );
  }
}
