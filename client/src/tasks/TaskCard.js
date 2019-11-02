import React, { Component } from 'react';

import './styles/TaskCard.css';
import { Button } from '../widgets/Button';
import { Members } from './Members';

export class TaskCard extends Component {
  constructor() {
    super();
    this.state = {
      task: null,
      visible: false
    };
  }

  componentWillReceiveProps({ task: nextTask }) {
    const setVisibility = visible => this.setState({ visible });
    if (!this.props.task && nextTask) {
      this.setState({ task: nextTask });
      setTimeout(() => setVisibility(true), 0);
    } else if (this.props.task && !nextTask) {
      setVisibility(false);
      setTimeout(() => {
        this.setState({ task: null });
      }, 200);
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
    const task = this.getTask() || {};
    const hidden = this.state.visible ? '' : ' hidden';
    return this.state.task === null ? null : (
      <div className={ "TaskCard" + hidden }>
        <div
          onClick={ this.props.onClose }
          className="background"
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
