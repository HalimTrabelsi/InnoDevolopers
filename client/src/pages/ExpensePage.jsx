import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashboardExpenceLayer from "../components/DashboardExpenceLayer";

const ExpensePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Expense dashboard' />

        {/* DashBoardLayerEleven */}
        <DashboardExpenceLayer />
      </MasterLayout>
    </>
  );
};

export default ExpensePage;
