import React, { Component } from 'react';
import { NegativeSpace } from './NegativeSpace';
import { Spinner } from './Spinner';

import './styles/Editor.css';

export class Editor extends Component {
  constructor(props) {
    super(props);
    if (window.incrementingId === undefined) {
      window.incrementingId = 0;
    } else {
      ++window.incrementingId;
    }
    this.inputRefName = `editor-input-${window.incrementingId}`;
    this.state = {
      editing: false
    };
  }

  setEditing = value =>
    this.setState({ editing: value });

  componentDidUpdate() {
    const input = this.refs[this.inputRefName];
    if (input && this.state.editing) {
      input.focus();
    }
  }

  render() {
    const extraClass = this.props.headline ? " title" : "";
    const multi = this.props.multiline;
    const editing = this.state.editing;
    const input = ( multi ?
      <textarea
        ref={ this.inputRefName }
        onBlur={ () => this.setEditing(false) }
        onFocus={ () => this.setEditing(true) }
        className={ "textarea" + extraClass }
        onChange={ this.props.onChange }
        value={ this.props.value }
      /> :
      <input
      ref={ this.inputRefName }
        type="text"
        onBlur={ () => this.setEditing(false) }
        onFocus={ () => this.setEditing(true) }
        className={ "input" + extraClass }
        onChange={ this.props.onChange }
        value={ this.props.value }
      />
    );
    return (
        <NegativeSpace
          className={ `Editor ${editing ? "editing" : ""}` }
          disabled={ !editing }
        >{this.props.loading && <Spinner />}{input}</NegativeSpace>
    );
  }
}
