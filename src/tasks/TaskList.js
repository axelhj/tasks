import React, { Component } from 'react';

import './TaskList.css';

export class TaskList extends Component {
  render() {
    return (
      <div className="TaskList">
        { this.props.tasks.map(task =>
          <li
            key={task.name + "TODO:USE ID"}
            className="item"
            onClick={ () => this.props.onClick(task) }
          >{ task.name }</li>
        ) }
        <div
          className="item add-item"
          onClick={ this.props.onClickAddTask }
        >Add task...</div>
      </div>
    );
  }
}
