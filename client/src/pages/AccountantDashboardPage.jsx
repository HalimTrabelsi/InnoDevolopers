import React from "react";
import MasterLayoutaccountant from "../masterLayout/MasterLayoutaccountant";
import Breadcrumb from "../components/Breadcrumb";
import AccountantDashboardLayer from "../components/AccountantDashboardLayer";

const AccountantDashboardPage = () => {
  return (
    <>
     {/* MasterLayout */}
     <MasterLayoutaccountant>
        {/* Breadcrumb */}
        <Breadcrumb title="Accountant Dashboard" />
      <AccountantDashboardLayer />
      </MasterLayoutaccountant>
    </>
  );
};

export default AccountantDashboardPage;
