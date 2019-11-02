import React, { Component } from 'react';

import { TaskList } from './TaskList.js';
import './TaskPane.css';

export class TaskPane extends Component {
  render() {
    return (
      <div className="TaskPane list-container">
        { this.props.taskLists.map(taskList =>
          <div
            key={ taskList.id + taskList.name}
            className="list-item"
          >
            <h3>{ taskList.name }</h3>
            <TaskList
              tasks={ taskList.tasks }
              onClick={ task => this.props.onClick(task, taskList.id) }
              onClickAddTask={ () => this.props.onAddTask(taskList) }
            />
          </div>) }
          <div className="list-item add-pane" onClick={ this.props.onAddPane }>
            <h3>Add pane...</h3>
          </div>
      </div>
    );
  }
}
