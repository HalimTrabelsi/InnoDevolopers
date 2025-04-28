import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    priority: "Medium",
  });

  useEffect(() => {
    axios.get("http://localhost:5001/api/ownerdashboard/getownerdashboard")
      .then((response) => {
        if (Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else {
          console.error("Unexpected response format:", response.data);
          setTasks([]);
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.deadline) return;

    axios.post("http://localhost:5001/api/ownerdashboard/addownerdashboard", newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setShowForm(false);
        setNewTask({ title: "", deadline: "", priority: "Medium" });
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="card p-3 shadow-sm radius-8 border h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">📅 Upcoming Tasks & Deadlines</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
          ➕ Add
        </button>
      </div>

      <ul className="list-group">
        {tasks.length > 0 ? tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{task.title}</strong> <br />
              <small className={`text-${new Date(task.deadline) < new Date() ? "danger" : "dark"}`}>
                Due: {task.deadline}
              </small>
            </div>
            <span className={`badge bg-${getPriorityColor(task.priority)} p-2`}>{task.priority}</span>
          </li>
        )) : (
          <p className="text-muted">No tasks available.</p>
        )}
      </ul>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h5 className="mb-3">➕ Add a New Task</h5>
            <form onSubmit={addTask}>
              <input type="text" name="title" className="form-control mb-2" placeholder="Task Title" value={newTask.title} onChange={handleChange} required />
              <input type="date" name="deadline" className="form-control mb-2" value={newTask.deadline} onChange={handleChange} required />
              <select name="priority" className="form-control mb-3" value={newTask.priority} onChange={handleChange}>
                <option value="High">🔥 High</option>
                <option value="Medium">⚠️ Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">✅ Save</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 350px;
        }
      `}</style>
    </div>
  );
};

export default TaskDashboard;
