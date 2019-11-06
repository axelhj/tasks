import React, { Component } from 'react';

import './styles/Select.css';
import { Button } from '../widgets/Button';
import { NegativeSpace } from '../widgets/NegativeSpace';

export class Select extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  isChecked = ({ id }) =>
    !!this.props.checkedValues.find(value => value.id === id)

  getOptionLabel(option) {
    return option[this.props.labelKey || "name"];
  }

  onToggleOpen = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  }

  onSelectOption(option) {
    const filteredValues = this.props.checkedValues.filter(({ id }) => id !== option.id);
    if (filteredValues.length === this.props.checkedValues.length) {
      this.props.onSelect([ ...this.props.checkedValues, option]);
    } else {
      this.props.onSelect(filteredValues);
    }
  }

  render() {
    return (
      <div className="Select">
        { this.state.expanded ?
          <div className="list">
            <NegativeSpace onClick={ this.onToggleOpen }>
              { this.props.options.map(option => (
                <p
                  key={ option.id }
                  className="option"
                  onClick={ () => this.onSelectOption(option) }
                >
                  <span className={
                    `checkmark ${this.isChecked(option) ? " checked" : ""}`
                  }></span>
                  { " " }
                  <span className="label">{ this.getOptionLabel(option) }</span>
                </p>
              )) }
            </NegativeSpace>
          </div> :
          <Button onClick={ this.onToggleOpen }>{ this.props.buttonLabel || "Select" }</Button>
        }
      </div>
    );
  }
}
