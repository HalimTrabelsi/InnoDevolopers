import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwenty from "../components/DashBoardLayerTwenty";

const HomePageTwenty = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Calendar' />

        {/* DashBoardLayerTen */}
        <DashBoardLayerTwenty />
      </MasterLayout>
    </>
  );
};

export default HomePageTwenty;
