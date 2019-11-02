import React, { Component } from 'react';

import './styles/NegativeSpace.css';

export class NegativeSpace extends Component {
  render() {
    const { disabled } = this.props;
    const className = this.props.className;
    return (
      <div className={ `NegativeSpace ${className || ''}` }>
        { !disabled && <div className="ns" onClick={ this.props.onClick }></div> }
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
}
