import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ComplianceLayer from "../components/CompilanceLayer";

const TextGeneratorPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Compliance Analysist" />

        {/* TextGeneratorLayer */}
        <ComplianceLayer />

      </MasterLayout>

    </>
  );
};

export default TextGeneratorPage; 
