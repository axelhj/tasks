import React, { Component } from 'react';

import './styles/Button.css';

export class Button extends Component {
  render() {
    return (
      <button
        className="Button"
        type="button"
        onClick={ this.props.onClick }
      >{this.props.children}</button>
    );
  }
}
