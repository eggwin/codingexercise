import React, { Component, PropTypes } from 'react';
import { Tasks } from '../api/tasks.js';
import ReactDOM from 'react-dom';

export default class Task extends Component {
	toggleChecked() {
		Tasks.update(this.props.task._id, {
		  $set: { checked: !this.props.task.checked }
		});
	}

	deleteThisTask() {
		Tasks.remove(this.props.task._id);
	}

	taskEdit(e) {
		const input = ReactDOM.findDOMNode(this.refs.taskEditText);
		$(input).select();
	}

	updateTaskText(e) {
		e.preventDefault();
		const input = ReactDOM.findDOMNode(this.refs.taskEditText);
		const text = input.value.trim();
		if (text.length) {
			Tasks.update(this.props.task._id, {
				$set: { text: text }
			});
			input.blur();
		} else {
			alert("Please enter a name for this todo (not blank)");
		}
	}

	changePriority(e) {
		e.preventDefault();
		const priority = parseInt(ReactDOM.findDOMNode(this.refs.priority).value);
		Tasks.update(this.props.task._id, {
			$set: { priority: priority }
		});
	}

	updateDate(e) {
		const date = ReactDOM.findDOMNode(this.refs.todoDate).value;
		Tasks.update(this.props.task._id, {
			$set: { targetDate: date}
		})
	}

	render() {
		const taskClassName = this.props.task.checked ? 'checked' : 'taskItem';
		return (
			<li className={taskClassName}>
				<button className="delete" onClick={this.deleteThisTask.bind(this)}>&times;</button>
				<button className="edit" ref="taskEditButton" onClick={this.taskEdit.bind(this)} disabled={this.props.task.checked ? true : false}>Edit</button>
				<label className="completed">
					<span>Complete</span>
					<input type="checkbox" readOnly ref="completeCheckbox" defaultValue={false} checked={this.props.task.checked} onClick={this.toggleChecked.bind(this)} />
				</label>
				<form className="edit-task" onSubmit={this.updateTaskText.bind(this)} >
					<input type="text" ref="taskEditText" className="text" defaultValue={this.props.task.text} disabled={this.props.task.checked ? true : false} />
					<div className="priorityContainer">
						<label className="row selectLabel">
							<span>Prioritize:&nbsp;</span>
							<select defaultValue={this.props.task.priority} ref="priority" onChange={this.changePriority.bind(this)} disabled={this.props.task.checked ? true : false}>
								<option value="5">Critical</option>
								<option value="4">High</option>
								<option value="3">Normal</option>
								<option value="2">Low</option>
								<option value="1">Nice To Have</option>
							</select>
						</label>
					</div>
					<div className="targetDateContainer">
						<label className="row dateLabel">
							<span>Target Date:&nbsp;</span>
							<input type="date" ref="todoDate" className="date" defaultValue={this.props.task.targetDate} disabled={this.props.task.checked ? true : false} onChange={this.updateDate.bind(this)}/>
						</label>
					</div>
				</form>
			</li>
		);
	}
}
 
Task.propTypes = {
  task: PropTypes.object.isRequired
};