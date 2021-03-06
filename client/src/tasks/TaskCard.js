import React, { Component } from 'react';

import './styles/TaskCard.css';
import { Button } from '../widgets/Button';
import { Editor } from '../widgets/Editor';
import { Select } from '../widgets/Select';

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
    this.setState(state => ({
      task: {
        ...state.task,
        members
      }
    }));
  }

  onTitleChange = ({ target: { value: title } }) => {
    this.setState(state => ({
      ...state, task: ({ ...state.task, title })
    }));
  }

  onDescriptionCHange = ({ target: { value: description } }) => {
    this.setState(state => ({
      ...state, task: ({ ...state.task, description })
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
          { this.props.selectedTaskIsPendingUpdate && <div className="overlay-blocker" /> }
          <div className="inner-content">
            <div className="layout">
              <Editor
                loading={ this.props.selectedTaskIsPendingUpdate }
                value={ task.title}
                onChange={ this.onTitleChange }
              />
              <Editor
                multiline={true}
                value={ task.description}
                onChange={ this.onDescriptionCHange }
              />
            </div>
            <div className="actions">
              <Select
                checkedValues={ task.members || [] }
                options={ this.props.teamMembers }
                onSelect={ this.onMembersUpdated }
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
