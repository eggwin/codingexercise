import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAll: true,
			showCompleted: false,
			showPriority: false,
			showTargetDate: false,
			selectedOption: "showall"
		};
	  }

	handleSubmit(e) {
		e.preventDefault();
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
		Tasks.insert({
			text,
			createdAt: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
			targetDate: moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
			priority: 3
		});
		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	handleRadioChange(e) {
		this.setState({
			selectedOption: e.target.value
		});
	}

	renderTasks() {
		let filteredTasks = this.props.tasks;
		let priorities = this.props.priorities;
		let targetDate = this.props.targetDate;

		switch(this.state.selectedOption) {
			case 'showall': filteredTasks = filteredTasks.filter(task => task); break;
			case 'showcompleted': filteredTasks = filteredTasks.filter(task => task.checked); break;
			case 'showpriority': filteredTasks = priorities.filter(task => !task.checked); break;
			case 'showtargetdate': filteredTasks = targetDate.filter(task => !task.checked); break;
			default: filteredTasks = filteredTasks.filter(task => task); break;
		}

		return filteredTasks.map((task) => (
			<Task key={task._id} task={task} />
		));
	}

	render() {
		return (
		  <div className="container">
			<header>
			  <h1>Todo List</h1>
			  <fieldset>
				<legend>Filter:</legend>
				<label className="show show-all">
				  <input type="radio" name="taskType" readOnly checked={this.state.selectedOption === 'showall'} value="showall" onChange={this.handleRadioChange.bind(this)}/>
				  Show All Todos
				</label>
				<label className="show show-completed">
				  <input type="radio" name="taskType" readOnly checked={this.state.selectedOption === 'showcompleted'} value="showcompleted" onChange={this.handleRadioChange.bind(this)}/>
				  Show Completed Todos
				</label>
				<label className="show show-priority">
				  <input type="radio" name="taskType" readOnly checked={this.state.selectedOption === 'showpriority'} value="showpriority" onChange={this.handleRadioChange.bind(this)}/>
				  Show Uncompleted Todos by Priority
				</label>
				<label className="show show-target-date">
				  <input type="radio" name="taskType" readOnly checked={this.state.selectedOption === 'showtargetdate'} value="showtargetdate" onChange={this.handleRadioChange.bind(this)}/>
				  Show Uncompleted Todos by Target Date
				</label>
			  </fieldset>
			  <div className="notify">You have <span className="emphasis">{this.props.completedCount}</span> todo{this.props.completedCount !== 1 ? 's' : ''} completed and <span className="emphasis">{this.props.incompleteCount}</span> todo{this.props.incompleteCount !== 1 ? 's' : ''} remaining</div>
			   <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
				<input type="text" ref="textInput" placeholder="Type to add a new todo, then hit enter"/>
			  </form>
			</header>

			<ul>
			  {this.renderTasks()}
			</ul>
		  </div>
		);
	}
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,
	priorities: PropTypes.array.isRequired,
	targetDate: PropTypes.array.isRequired,
	incompleteCount: PropTypes.number.isRequired,
	completedCount: PropTypes.number.isRequired
};

export default createContainer(() => {
	return {
		tasks: Tasks.find({}, { sort: {checked: 1, createdAt: -1 }}).fetch(),
		priorities: Tasks.find({}, {sort: {priority: -1 }}).fetch(),
		targetDate: Tasks.find({}, {sort: {targetDate: -1 }}).fetch(),
		incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
		completedCount: Tasks.find({ checked: { $eq: true } }).count()
	};
}, App);