import React, { Component } from 'react';

import './NegativeSpace.css';

export class NegativeSpace extends Component {
  render() {
    const { disabled } = this.props;
    return (
      <div className={ "NegativeSpace" + (disabled ? " disabled" : "") }>
        <div className="ns" onClick={ this.props.onClick }></div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
}
