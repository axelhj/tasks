import React, { Component } from 'react';
import './styles/Tasks.css';
import { Editor } from '../widgets/Editor.js'
import { Select } from '../widgets/Select.js'
import { TaskCard } from './TaskCard.js'

const baseUrl = "";

class Tasks extends Component{
  constructor() {
    super();
    this.state = {
      selectedTask: null,
      selectedTaskIsPendingUpdate: false,
      selectedPane: null,
      taskLists: [],
      listsPendingUpdate: [],
      taskListOfIdIsPendingDelete: null
    };
    this.pendingNameEdits = [];
    this.lastKnownCorrectName = null;
    this.toggleTaskListRefs = {};
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
      const value = parseInt((taskList.name.match(/\d+$/) || [])[0], 10);
      if (!Number.isNaN(value) && value > paneNumber) {
        paneNumber = value;
      }
    }
    const newTaskList = {
      id: null,
      name: `Pane ${paneNumber + 1}`,
      tasks: []
    };
    const newTaskLists = [ ...taskLists, newTaskList ];
    this.setState({ taskLists: newTaskLists });
    fetch(`${baseUrl}/lists`, {
      method: 'POST',
      body: JSON.stringify(newTaskList),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then(res => res.json())
    .then(({ id }) => {
      this.setState({ taskLists: [
        ...taskLists,
        {
          ...newTaskList,
          id
        }
      ]});
    })
    .catch(error => {
      console.error(`Error adding new list: ${error}`);
      this.setState({ taskLists });
    });
  }

  onAddTask = taskList => {
    const { tasks } = taskList;
    let taskNumber = 0;
    for (let task of tasks) {
      const value = parseInt((task.title.match(/\d+$/) || [])[0], 10);
      if (!Number.isNaN(value) && value > taskNumber) {
        taskNumber = value;
      }
    }
    this.setState({
      selectedTask: {
        id: null,
        title: `Task ${taskNumber + 1}`,
        description: "",
        list: taskList.id,
        members: []
      },
      selectedPane: taskList.id
    });
  }

  onTaskListNameChange({ target: { value: name } }, index) {
    const { taskLists } = this.state;
    const updatedTaskList = taskLists[index];
    this.pendingNameEdits.push(updatedTaskList.name);
    const removeByItemKeyValue = (list, value, key = 'id') => list
      .filter(item => item[key] !== value);
    if (this.lastKnownCorrectName === null) {
      this.lastKnownCorrectName = updatedTaskList.name;
    }
    this.setState(({ listsPendingUpdate }) => ({
      listsPendingUpdate: removeByItemKeyValue(listsPendingUpdate, updatedTaskList.id)
        .concat([updatedTaskList.id])
    }));
    const copyAndReplaceAt = (list, i, value) => {
      const newList = [...list];
      newList[i] = value;
      return newList;
    };
    this.setState(state => ({
      ...state,
      taskLists: copyAndReplaceAt(
        state.taskLists,
        index,
        { ...state.taskLists[index], name }
      )
    }));
    fetch(`${baseUrl}/lists/${updatedTaskList.id}`, {
      method: 'POST',
      body: JSON.stringify(updatedTaskList),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then(res => res.json())
    .then(() => {
      this.pendingNameEdits = removeByItemKeyValue(this.pendingNameEdits, updatedTaskList.name, 'name')
      this.lastKnownCorrectName = name;
    })
    .catch(error => {
      console.error(`Error updating name: ${error}`);
      this.setState(state => ({
        taskLists: copyAndReplaceAt(
          state.taskLists,
          index,
          {
            ...updatedTaskList,
            name: this.pendingNameEdits[0] || this.lastKnownCorrectName
          }
        )
      }));
      this.pendingNameEdits = removeByItemKeyValue(this.pendingNameEdits, updatedTaskList.name, 'name')
    })
    .then(() => {
      this.setState(({ listsPendingUpdate }) => ({
        listsPendingUpdate: removeByItemKeyValue(listsPendingUpdate, updatedTaskList.id)
      }));
    });
  }

  onDeleteTaskList(id) {
    this.setState({ taskListOfIdIsPendingDelete: id });
    const url = `${baseUrl}/lists/${id}/delete`;
    fetch(url, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(() => {
      this.setState(({ taskLists }) => ({
        taskLists: taskLists.filter(({ id: taskListId }) => id !== taskListId)
      }));
    })
    .catch(error => {
      console.error(`Error deleting tasklist: ${error}`);
    })
    .then(() => {
      this.setState({ taskListOfIdIsPendingDelete: false });
    });
  }

  onSaveTask = savedTask => {
    this.setState({ selectedTaskIsPendingUpdate: true });
    const { selectedPane, taskLists } = this.state;
    let url;
    if (savedTask.id === null) {
      url = `${baseUrl}/tasks`;
    } else {
      url = `${baseUrl}/tasks/${savedTask.id}`;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(savedTask),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then(res => res.json())
    .then(({ id }) => {
      const selectedTaskList = taskLists.find(taskList => taskList.id === selectedPane);
      const selectedTask = selectedTaskList.tasks
        .find(task => task.id === savedTask.id);
      if (savedTask.id === null) {
        savedTask.id = id;
      }
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
    })
    .catch(error => {
      console.error(`Error saving task: ${error}`);
    })
    .then(() => {
      this.setState({ selectedTaskIsPendingUpdate: false });
    });
  }

  onDeleteTask = deletedTask => {
    this.setState({ selectedTaskIsPendingUpdate: true });
    const { selectedPane, taskLists } = this.state;
    fetch(`${baseUrl}/tasks/${deletedTask.id}/delete`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(() => {
      const selectedTaskList = taskLists.find(taskList => taskList.id === selectedPane);
      if (selectedTaskList.tasks.find(task => task.id === deletedTask.id)) {
        selectedTaskList.tasks.splice(selectedTaskList.tasks.indexOf(deletedTask), 1);
      }
      this.setState({
        selectedTask: null,
        selectedPane: null,
        taskLists
      });
    })
    .catch(error => {
      console.error(`Error deleting task: ${error}`);
    })
    .then(() => {
      this.setState({ selectedTaskIsPendingUpdate: false });
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
          selectedTaskIsPendingUpdate={ this.state.selectedTaskIsPendingUpdate }
        />
        <div className="TaskPane">
          { this.state.taskLists.map((taskList, index) =>
            <div
              key={ taskList.id}
              className="list-item"
            >
              { this.state.taskListOfIdIsPendingDelete === taskList.id &&
                <div className="overlay-blocker" />
              }
              <Editor
                title={ true }
                value={ taskList.name}
                onChange={ e => this.onTaskListNameChange(e, index) }
              />
              <Select
                options={ [ { id: 0, label: "Delete list" } ] }
                labelKey="label"
                checkedValues={ [] }
                onSelect={ () => {
                  this.onDeleteTaskList(taskList.id);
                  this.toggleTaskListRefs[index]();
                } }
                triggerToggleRef={ ref => this.toggleTaskListRefs[index] = ref }
              >
                <span onClick={ () => this.toggleTaskListRefs[index]() }>...</span>
              </Select>
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
