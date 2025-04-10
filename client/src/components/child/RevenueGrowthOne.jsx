import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import Chart from 'react-apexcharts';

const RevenueGrowthOne = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API response
        const revenueData = [
          { source: 'Online Sales', amount: 3221 },
          { source: 'Subscription Fees', amount: 2500 },
          { source: 'Consulting Services', amount: 1800 },
          { source: 'Freelance Projects', amount: 3200 },
          { source: 'Ad Revenue', amount: 6000 }
        ];

        const amounts = revenueData.map(item => item.amount);
        const labels = revenueData.map(item => item.source);

        setChartData({
          series: amounts,
          options: {
            ...chartData.options,
            labels: labels
          }
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-xxl-4 col-sm-6">
      <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-3">
        <div className="card-body p-0">
          <h5 className="text-center">Revenue Distribution</h5>
          <Chart options={chartData.options} series={chartData.series} type="pie" width="100%" />
        </div>
      </div>
    </div>
  );
};



export default RevenueGrowthOne;
