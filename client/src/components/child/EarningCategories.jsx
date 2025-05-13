import React, { useEffect, useState } from 'react';
import axios from 'axios';

const targetByCategory = {
  'Software & Tools': 1000,
  'Office & Infrastructure': 1500,
  'Marketing & Advertising': 2000,
  'Salaries & Freelancers': 5000,
};

const categoryColors = {
  'Software & Tools': 'bg-primary-600',
  'Office & Infrastructure': 'bg-orange',
  'Marketing & Advertising': 'bg-yellow',
  'Salaries & Freelancers': 'bg-success-main',
};

const categoryIcons = {
  'Software & Tools': 'earn-cat-icon1.svg',
  'Office & Infrastructure': 'earn-cat-icon2.svg',
  'Marketing & Advertising': 'earn-cat-icon3.svg',
  'Salaries & Freelancers': 'earn-cat-icon4.svg',
};

const EarningCategories = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/expenses/categories')
      .then(res => {
        setExpenses(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  return (
    <div className='col-md-6'>
      <div className='card radius-16 h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Expense Categories</h6>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex flex-column gap-20'>

            {expenses.map((item, i) => {
              const category = item._id;
              const current = item.totalAmount;
              const target = targetByCategory[category] || 1000;
              const percent = Math.min((current / target) * 100, 100).toFixed(0);
              const color = categoryColors[category] || 'bg-primary-600';
              const icon = categoryIcons[category] || 'earn-cat-icon1.svg';

              return (
                <div key={i} className='d-flex align-items-center justify-content-between gap-3'>
                  <div className='d-flex align-items-center w-100 gap-12'>
                    <span className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-primary-100'>
                      <img
                        src={`assets/images/home-eleven/icons/${icon}`}
                        alt=''
                      />
                    </span>
                    <div className='flex-grow-1'>
                      <h6 className='text-sm mb-0'>{category}</h6>
                      <span className='text-xs text-secondary-light fw-medium'>
                        {current} DT / from {target} DT
                      </span>
                    </div>
                  </div>
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <div className='w-100 max-w-66 ms-auto'>
                      <div
                        className='progress progress-sm rounded-pill'
                        role='progressbar'
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`progress-bar ${color} rounded-pill`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-secondary-light font-xs fw-semibold'>
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningCategories;
