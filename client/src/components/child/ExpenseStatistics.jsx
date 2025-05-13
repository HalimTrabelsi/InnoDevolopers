import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalExpenses = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5001/api/expenses/total')
      .then(res => setTotal(res.data.total))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card bg-primary text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">💰 Total Expenses</h2>
      <p className="text-3xl mt-2">${total.toFixed(2)}</p>
    </div>
  );
};

export default TotalExpenses;
