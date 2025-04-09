import React from 'react'
import UnitCountTwo from './child/UnitCountTwo'
import RevenueGrowthOne from './child/RevenueGrowthOne'
import EarningStaticOne from './child/EarningStaticOne'

const BuisnessOwnerDashboard = () => {
  return (
    <section className="row gy-4">

      {/* UnitCountTwo */}
      <UnitCountTwo />

      {/* RevenueDistribution */}
      <RevenueGrowthOne />

      {/* RevenueData */}
      <EarningStaticOne />

      
    </section>

  )
}

export default BuisnessOwnerDashboard