import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { FaCalendarAlt, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const PrioritizedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ priority: 'all', overdue: 'all' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token used:', token);
        if (!token) {
          throw new Error('No token found in localStorage');
        }

        const response = await axios.get('http://localhost:5001/api/tasks/prioritized', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API response:', response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error during request:', err.response ? err.response.data : err.message);
        setError('Error loading tasks: ' + (err.response ? err.response.data.message : err.message));
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return now > deadlineDate;
  };

  const filteredTasks = tasks
    .filter((task) => {
      const priorityMatch = filter.priority === 'all' || 
        (filter.priority === 'high' && task.adjustedPriority >= 7) ||
        (filter.priority === 'medium' && task.adjustedPriority >= 4 && task.adjustedPriority < 7) ||
        (filter.priority === 'low' && task.adjustedPriority < 4);
      const overdueMatch = filter.overdue === 'all' || 
        (filter.overdue === 'yes' && isDeadlinePassed(task.deadline)) ||
        (filter.overdue === 'no' && !isDeadlinePassed(task.deadline));
      return priorityMatch && overdueMatch;
    })
    .sort((a, b) => b.adjustedPriority - a.adjustedPriority); // Sort by priority

  const chartData = {
    labels: filteredTasks.map((task) => task.title),
    datasets: [
      {
        label: 'Priority (0-10)',
        data: filteredTasks.map((task) => task.adjustedPriority),
        backgroundColor: filteredTasks.map((task) =>
          task.adjustedPriority >= 7 ? 'rgba(255, 99, 132, 0.6)' :
          task.adjustedPriority >= 4 ? 'rgba(255, 206, 86, 0.6)' :
          'rgba(75, 192, 192, 0.6)'
        ),
        borderColor: filteredTasks.map((task) =>
          task.adjustedPriority >= 7 ? 'rgba(255, 99, 132, 1)' :
          task.adjustedPriority >= 4 ? 'rgba(255, 206, 86, 1)' :
          'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // Horizontal bars
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        title: { display: true, text: 'Priority (0-10)' },
      },
      y: {
        title: { display: true, text: 'Tasks' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const task = filteredTasks[context.dataIndex];
            return [
              `Priority: ${task.adjustedPriority}/10`,
              `Deadline: ${new Date(task.deadline).toLocaleDateString()}`,
              `Created: ${new Date(task.createdAt).toLocaleDateString()}`,
              `Updated: ${new Date(task.updatedAt).toLocaleDateString()}`,
              isDeadlinePassed(task.deadline) ? '⚠️ Overdue' : '⏰ On Time',
            ];
          },
        },
      },
    },
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Prioritized Tasks </h2>

      {/* Filters */}
      <div className="mb-6 flex flex-col items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Priority:</label>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setFilter({ ...filter, priority: 'all' })}
              className={`px-3 py-1 rounded ${filter.priority === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ ...filter, priority: 'high' })}
              className={`px-3 py-1 rounded ${filter.priority === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              High (7-10)
            </button>
            <button
              onClick={() => setFilter({ ...filter, priority: 'medium' })}
              className={`px-3 py-1 rounded ${filter.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Medium (4-6)
            </button>
            <button
              onClick={() => setFilter({ ...filter, priority: 'low' })}
              className={`px-3 py-1 rounded ${filter.priority === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Low (0-3)
            </button>
          </div>
        </div>
        <div>
          <label className="mr-2 font-medium">Deadline:</label>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setFilter({ ...filter, overdue: 'all' })}
              className={`px-3 py-1 rounded ${filter.overdue === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ ...filter, overdue: 'yes' })}
              className={`px-3 py-1 rounded ${filter.overdue === 'yes' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilter({ ...filter, overdue: 'no' })}
              className={`px-3 py-1 rounded ${filter.overdue === 'no' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Not Overdue
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks to display.</p>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PrioritizedTasks;