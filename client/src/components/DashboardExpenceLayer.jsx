import React from "react";
import UnitCountEight from "./child/UnitCountEight";
import BalanceStatistic from "./child/BalanceStatistic";
import EarningCategories from "./child/EarningCategories";
import ExpenseStatistics from "./child/ExpenseStatistics";
import PaymentHistory from "./child/PaymentHistory";
import MonthlyExpenseBreakdown from "./child/MonthlyExpenseBreakdown";
import QuickTransfer from "./child/QuickTransfer";
import Investment from "./child/Investment";
import PaymentHistoryOne from "./child/PaymentHistoryOne";
import ActiveList from "./child/ActiveList";
const DashboardExpenceLayer = () => {
  return (
    <>


      <div className='mt-24'>
        <div className='row gy-4'>
          <div className='col-xl-8'>
            <div className='row gy-4'>
              {/* BalanceStatistic */}
              {/* <BalanceStatistic /> */}

              {/* Expense Categories */}
              <EarningCategories />


              {/* TotalExpenses */}
              <ExpenseStatistics />



              {/* SpendingHealthMeter  */}
              {/* <MonthlyExpenseBreakdown /> */}
            </div>
          </div>
          {/* Sidebar start */}

              <div className='col-xl-4'>
            {/* Investment */}
            <Investment />
          </div>
                    <div className='col-xl-4'>

              {/* RecurringPieChart */}
              <PaymentHistory />
</div>
          {/* Sidebar end */}
        </div>
      </div>

      {/* Tax count down */}
      <PaymentHistoryOne />
      <ActiveList/>
    </>
  );
};

export default DashboardExpenceLayer;
