import React from "react";
import MasterLayoutfinancial from "../masterLayout/MasterLayoutfinancial";
import Breadcrumb from "../components/Breadcrumb";
import FinancialMangerLayer from "../components/FinancialMangerLayer";


const FinancialManagerPage = () => {
  return (
    <>
     {/* MasterLayout */}
     <MasterLayoutfinancial>
        {/* Breadcrumb */}
        <Breadcrumb title="Financial-Manager-Dashboard" />
      <FinancialMangerLayer />
      </MasterLayoutfinancial>
    </>
  );
};

export default FinancialManagerPage;
