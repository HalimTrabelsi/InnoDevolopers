import React, { useEffect, useState } from 'react';
import useCountdown from '../../hook/useCountdown';
import axios from 'axios';

const TaxCountdown = () => {
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/tax-deadlines', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      const upcoming = res.data.data.find(d => new Date(d.date) > new Date());
      if (upcoming) setDeadline(upcoming);
    }).catch(err => {
      console.error("Error fetching tax deadlines:", err); // Add error handling
    });
  }, []);

  const [days, hours, minutes, seconds] = useCountdown(deadline?.date); // ✅ Always call this, even if deadline is null

  if (!deadline) return <div className="card p-4">🎉 No upcoming deadlines!</div>;

  return (
    <div className="card bg-danger text-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">⏳ Tax Deadline Countdown</h2>
      <h4>{deadline.title}</h4>
      <p className="text-sm mb-2">{deadline.message}</p>
      <div className="text-2xl font-bold">
        {days}d {hours}h {minutes}m {seconds}s
      </div>
    </div>
  );
};

export default TaxCountdown;