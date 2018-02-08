import React, { Component } from 'react';

import './TaskCard.css';
import { Button } from '../widgets/Button';
import { Members } from './Members';

export class TaskCard extends Component {
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
                  { this.props.task.name}
                  { this.props.task.description }
                </div>
                <div className="action-bar">
                  <Members />
                </div>
              </div>
              <div className="button-bar">
                <Button
                  onClick={ () => this.props.onDelete(this.props.task) }
                >Delete</Button>
                <Button
                  onClick={ () => this.props.onSave(this.props.task) }
                >Save</Button>
              </div>
            </div>
          ) }
          </div>
      </div>
    );
  }
}
