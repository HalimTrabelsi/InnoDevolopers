import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerViewTransaction from "../components/DashBoardLayerViewTransaction";

const HomePageViewTransaction = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='View Transaction ' />

        {/* DashBoardLayerTen */}
        <DashBoardLayerViewTransaction />
      </MasterLayout>
    </>
  );
};

export default HomePageViewTransaction;
