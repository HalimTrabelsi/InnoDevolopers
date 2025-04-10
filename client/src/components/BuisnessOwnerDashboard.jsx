import React from 'react'
import UnitCountTwo from './child/UnitCountTwo'
import RevenueGrowthOne from './child/RevenueGrowthOne'
import EarningStaticOne from './child/EarningStaticOne'

import Trading from './crypto/trading'
import Transaction from '../components/transaction/TransactionList'


const BuisnessOwnerDashboard = () => {
  return (
    <section className="row gy-4">
      
      <Trading></Trading>
      <Transaction></Transaction>
      <UnitCountTwo></UnitCountTwo>
      <RevenueGrowthOne></RevenueGrowthOne>
      <EarningStaticOne></EarningStaticOne>
     
    </section>

  )
}

export default BuisnessOwnerDashboard