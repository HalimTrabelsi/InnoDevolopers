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
import CompteBancaireTable from './CompteBancaire/CompteBancaireTable'

import Trading from './crypto/trading'
import Transaction from '../components/transaction/TransactionList'
import ChatBot from './chatbolt/ChatbotFinance'

const BuisnessOwnerDashboard = () => {
  const userId = "67cc34299384fa66108bb394";

  
  return (
    <section className="row gy-4">  

      {/* UnitCountTwo */}
      <UnitCountTwo />

      {/* RevenueGrowthOne */}
      
    

      {/* EarningStaticOne */}
      <EarningStaticOne />

      {/* CampaignStaticOne */}
      <CampaignStaticOne />

      {/* ClientPaymentOne  */}
      <ClientPaymentOne />

      {/* CountryStatusOne */}
      <CountryStatusOne />

      {/* TopPerformanceOne */}
      <TopPerformanceOne />

      {/* LatestPerformanceOne */}
      <LatestPerformanceOne />

      {/* LastTransactionOne */}
      <LastTransactionOne />
      
      <CompteBancaireTable userId={userId} />      
      <Trading></Trading>
      <ChatBot></ChatBot>
      <Transaction></Transaction>
      <UnitCountTwo></UnitCountTwo>
      <RevenueGrowthOne></RevenueGrowthOne>
      <EarningStaticOne></EarningStaticOne>
     
    </section>

  )
}

export default BuisnessOwnerDashboard