import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTransaction from "../components/DashBoardLayerTransaction";

const HomePageTransaction = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Transaction Health ' />

        {/* DashBoardLayerTen */}
        <DashBoardLayerTransaction />
      </MasterLayout>
    </>
  );
};

export default HomePageTransaction;
