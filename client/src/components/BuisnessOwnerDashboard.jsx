import React from 'react'
import UnitCountTwo from './child/UnitCountTwo'
import RevenueGrowthOne1 from './child/RevenueGrowthOne1'
import RevenueGrowthOne from './child/RevenueGrowthOne'
import EarningStaticOne from './child/EarningStaticOne'
import RevenuePrediction from "./RevenuePrediction";
import SmartRevenueOptimizer from './SmartRevenueOptimizer';
import DashboardDataFetcher from './DashboardDataFetcher';
import CampaignStaticOne from './child/CampaignStaticOne'
import ClientPaymentOne from './child/ClientPaymentOne'
import CountryStatusOne from './child/CountryStatusOne'
import TopPerformanceOne from './child/TopperformanceOne'
import LatestPerformanceOne from './child/LatestPerformanceOne'
import LastTransactionOne from './child/LastTransactionOne'
import CompteBancaireTable from './CompteBancaire/CompteBancaireTable'
import News from '../components/News/News'
import Trading from './crypto/trading'
import Transaction from '../components/transaction/TransactionList'
import ChatBot from './chatbolt/ChatbotFinance'
import FinancialT  from './FinancialTrends'

const BuisnessOwnerDashboard = () => {
  const userId = "67cc34299384fa66108bb394";

  
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

      {/* RevenueGrowthOne */}
      
    



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

      <FinancialT  />
      
      <CompteBancaireTable userId={userId} />      
      <Trading></Trading>
      <ChatBot></ChatBot>
      <Transaction></Transaction>
      <RevenueGrowthOne></RevenueGrowthOne>
      <EarningStaticOne></EarningStaticOne>
      <News></News>

    </section>

  )
}

export default BuisnessOwnerDashboard