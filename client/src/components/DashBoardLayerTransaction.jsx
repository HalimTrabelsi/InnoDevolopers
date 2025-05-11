import React from "react";
import IncomeStatement  from "./child/IncomeStatement ";
import IncomeVsExpense from "./child/IncomeVsExpense";
import UsersChart from "./child/UsersChart";
import TopExpenses from "./child/TopExpenses";
import TopCustomer from "./child/TopCustomer";
import FinancialOverview from "./child/FinancialOverview";
import PurchaseAndSales from "./child/PurchaseAndSales";
import RecentTransactions from "./child/RecentTransactions";

const DashBoardLayerTransaction = () => {
  return (
    <div className='row gy-4'>
      
     

      {/* RecentTransactions */}
      <RecentTransactions />
    </div>
  );
};

export default DashBoardLayerTransaction;
