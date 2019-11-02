import React, { Component } from 'react';
import './styles/Tasks.css';
import { TaskCard } from './TaskCard.js'

const baseUrl = "http://localhost:80";

class Tasks extends Component{
  constructor() {
    super();
    this.state = {
      selectedTask: null,
      selectedPane: null,
      taskLists: []
    };
  }

  componentDidMount() {
    Promise.all([
      fetch(`${baseUrl}/users`)
      .then(data => data.json()),
      fetch(`${baseUrl}/lists`)
      .then(data => data.json())
    ])
    .then(([members, taskLists]) => {
      this.setState({
        members,
        taskLists
      });
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

  render() {
    return (
      <div className="Tasks">
         <TaskCard
          task={ this.state.selectedTask }
          taskLists={ this.state.taskLists }
          teamMembers={ this.state.members }
          onClose={ this.closeSelectedTask }
          onSave={ this.onSaveTask }
          onDelete={ this.onDeleteTask }
        />
        <div className="TaskPane">
          { this.state.taskLists.map(taskList =>
            <div
              key={ taskList.id + taskList.name}
              className="list-item"
            >
              <h3>{ taskList.name }</h3>
              { taskList.tasks.map(task =>
                <li
                  key={task.id + task.title}
                  className="item"
                  onClick={ () => this.onClickTask(task, taskList.id) }
                >{ task.title }</li>
              ) }
              <div
                className="item add-item"
                onClick={ () => this.onAddTask(taskList) }
              >Add task...</div>
            </div>)
          }
          <div className="list-item add-pane" onClick={ this.onAddPane }>
            <h3>Add pane...</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Tasks;
