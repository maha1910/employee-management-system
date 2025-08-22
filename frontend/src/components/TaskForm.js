import React, { useState } from 'react';
import { createTask } from '../services/taskService';

const TaskForm = () => {
  const [taskData, setTaskData] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(taskData);
      alert('Task created!');
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={taskData.title} onChange={e => setTaskData({ ...taskData, title: e.target.value })} />
      <input value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default TaskForm;
