import React from 'react'
import UnitCountTwo from './child/UnitCountTwo'
import RevenueGrowthOne from './child/RevenueGrowthOne'
import EarningStaticOne from './child/EarningStaticOne'
import CampaignStaticOne from './child/CampaignStaticOne'
import ClientPaymentOne from './child/ClientPaymentOne'
import CountryStatusOne from './child/CountryStatusOne'
import TopPerformanceOne from './child/TopperformanceOne'
import LatestPerformanceOne from './child/LatestPerformanceOne'
import LastTransactionOne from './child/LastTransactionOne'
import UsersListLayer from './UsersListLayer'
import Trading from './crypto/trading'
import Transaction from '../components/transaction/TransactionList'


const BuisnessOwnerDashboard = () => {
  return (
    <section className="row gy-4">
      
      <Trading></Trading>
      <Transaction></Transaction>
     
    </section>

  )
}

export default BuisnessOwnerDashboard