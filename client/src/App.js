import React, { Component } from 'react';
import './App.css';
import { TaskPane } from './tasks/TaskPane.js';
import { TaskCard } from './tasks/TaskCard.js';

const baseUrl = "http://localhost:80";

const teamMembers = [
  { name: "Person 1" },
  { name: "Person 2" },
  { name: "Person 3" }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedTask: null,
      selectedPane: null,
      taskLists: []
    };
  }

  componentDidMount() {
    fetch(`${baseUrl}/lists`)
    .then(data => data.json())
    .then(lists => {
      const listsWithMembers = lists.map(list => {
        return { ...list, tasks: list.tasks.map(task => {
          return { ...task, members: [] };
        })}
      });
      this.setState({taskLists: listsWithMembers})
    });
  }

  onClickTask = (task, paneId) => {
    this.setState({
      selectedTask: task,
      selectedPane: paneId
    });
  }

  onAddPane = () => {
    const { taskLists } = this.state;
    let paneNumber = 0;
    for (let taskList of taskLists) {
      const value = parseInt((taskList.name.match(/\d$/) || [null])[0], 10);
      if (!Number.isNaN(value) && value > paneNumber) {
        paneNumber = value;
      }
    }
    taskLists.push({
      name: `Pane ${paneNumber + 1}`,
      tasks: []
    });
    this.setState({ taskLists });
  }

  onAddTask = taskList => {
    const { tasks } = taskList;
    let taskNumber = 0;
    for (let task of tasks) {
      const value = parseInt(task.title.match(/\d$/)[0], 10);
      if (!Number.isNaN(value) && value > taskNumber) {
        taskNumber = value;
      }
    }
    this.setState({
      selectedTask: {
        id: null,
        title: `Task ${taskNumber + 1}`,
        members: []
      },
      selectedPane: taskList.id
    });
  }

  onSaveTask = savedTask => {
    const { selectedPane, taskLists } = this.state;
    const selectedTaskList = taskLists.find(taskList => taskList.id === selectedPane);
    const selectedTask = selectedTaskList.tasks
      .find(task => task.title === savedTask.title);
    if (selectedTask) {
      selectedTaskList.tasks[selectedTaskList.tasks.indexOf(selectedTask)] = savedTask;
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
    const selectedTaskList = taskLists.find(taskList => taskList.id === selectedPane);
    if (selectedTaskList.tasks.find(task => task.title === deletedTask.title)) {
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
        taskLists={ this.state.taskLists }
        teamMembers={ teamMembers }
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
            onAddPane= { this.onAddPane }
            onAddTask={ this.onAddTask }
          ></TaskPane>
        </div>
      </div>
    );
  }
}

export default App;
