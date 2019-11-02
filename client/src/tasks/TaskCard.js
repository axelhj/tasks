import React, { Component } from 'react';

import './styles/TaskCard.css';
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
    if (this.state.task === null) {
      this.setState({
        task: nextProps.task
      });
    }
  }

  getTask() {
    return this.state.task || this.props.task;
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
    const task = this.getTask();
    if (!this.props.task) {
      return null;
    }
    const hidden = this.props.task === null ? ' hidden' : '';
    return (
      <div className={ "TaskCard" + hidden }>
        <div
          onClick={ this.props.onClose }
          className={ "background" }
        />
        <div className="outer-content">
          <div className="inner-content">
            <div className="layout">
              <div>{ task.title}</div>
              <div>{ task.description }</div>
            </div>
            <div className="actions">
              <Members
                assignedMembers={ task.members || [] }
                teamMembers={ this.props.teamMembers }
                onUpdated={ this.onMembersUpdated }
              />
            </div>
          </div>
          <div className="buttons">
            <Button
              onClick={ () => this.props.onDelete(this.state.task) }
            >Delete</Button>
            <Button
              onClick={ () => this.props.onSave(this.state.task) }
            >Save</Button>
          </div>
        </div>
      </div>
    );
  }
}
