import React, { Component } from 'react';
import './App.css';
import { TaskPane } from './tasks/TaskPane.js';
import { TaskCard } from './tasks/TaskCard.js';

class App extends Component {
  constructor() {
    super();
    const firstPane = {
      name: "Pane 1",
      tasks: [
        { name: "Task 1" },
        { name: "Task 2" }
      ]
    };
    const secondPane = {
      name: "Pane 2",
      tasks: [
        { name: "Task 3" },
        { name: "Task 4" }
      ]
    };
    this.state = {
      selectedTask: null,
      selectedPane: null,
      taskLists: [
        firstPane,
        secondPane
      ]
    };
  }

  componentDidMount() {
    // fetch(baseUrl + "/tasks")
    // .then(data => data.json())
    // .then(tasks => {
    //   this.setState({tasks})
    // });
  }

  onClickTask = (task, paneName) => {
    this.setState({
      selectedTask: task,
      selectedPane: paneName
    });
  }

  onAddTask = taskList => {
    const { name, tasks } = taskList;
    let taskNumber = 0;
    for (let task of tasks) {
      const value = parseInt(task.name.match(/\d$/)[0], 10);
      if (value > taskNumber) {
        taskNumber = value;
      }
    }
    this.setState({
      selectedTask: {
        name: `Task ${taskNumber + 1}`
      },
      selectedPane: name
    });
  }

  onSaveTask = savedTask => {
    const { selectedPane, taskLists } = this.state;
    const selectedTaskList = taskLists.find(taskList => taskList.name === selectedPane);
    if (selectedTaskList.tasks.find(task => task.name === savedTask.name)) {
      selectedTaskList.tasks[selectedTaskList.tasks.indexOf(savedTask)] = savedTask;
    } else {
      selectedTaskList.tasks.push(savedTask);
    }
    this.setState({
      selectedTask: null,
      selectedPane: null,
      taskLists
    });
  }

  onDeleteTask = deletedTask => {
    const { selectedPane, taskLists } = this.state;
    const selectedTaskList = taskLists.find(taskList => taskList.name === selectedPane);
    if (selectedTaskList.tasks.find(task => task.name === deletedTask.name)) {
      selectedTaskList.tasks.splice(selectedTaskList.tasks.indexOf(deletedTask), 1);
    }
    this.setState({
      selectedTask: null,
      selectedPane: null,
      taskLists
    });
  }

  closeSelectedTask = () => {
    this.setState({ selectedTask: null })
  }

  renderSelectedTask() {
    return (
      <TaskCard
        task={ this.state.selectedTask }
        onClose={ this.closeSelectedTask }
        onSave={ this.onSaveTask }
        onDelete={ this.onDeleteTask }
      />
    );
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">Welcome</h1>
        </header>
        { this.renderSelectedTask() }
        <div className="container">
          <TaskPane
            taskLists={ this.state.taskLists }
            onClick={ this.onClickTask }
            onAddTask={ this.onAddTask }
          ></TaskPane>
        </div>
      </div>
    );
  }
}

export default App;
