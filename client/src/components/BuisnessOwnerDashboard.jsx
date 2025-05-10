import React from 'react'
import UnitCountTwo from './child/UnitCountTwo'
import RevenueGrowthOne1 from './child/RevenueGrowthOne1'
import EarningStaticOne from './child/EarningStaticOne'
import RevenuePrediction from "./RevenuePrediction";
import SmartRevenueOptimizer from './SmartRevenueOptimizer';
import DashboardDataFetcher from './DashboardDataFetcher';

const BuisnessOwnerDashboard = () => {
  return (
    <section className="row gy-4">

      {/* UnitCountTwo */}
      <UnitCountTwo />
<div style={{ display: 'flex', gap: '20px' }}>
      {/* RevenueDistribution */}
      <RevenueGrowthOne1 />
      <RevenuePrediction />
      </div>
      {/* RevenueData */}
      <EarningStaticOne />


      {/* <SmartRevenueOptimizer/> */}
      <DashboardDataFetcher/>
    </section>

  )
}

export default BuisnessOwnerDashboard