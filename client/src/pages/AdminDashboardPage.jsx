import React from "react";
import MasterLayoutadmin from "../masterLayout/MasterLayoutadmin";
import Breadcrumb from "../components/Breadcrumb";
import AdminDashboard from "../components/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <>
      {/* MasterLayoutadmin */}
      <MasterLayoutadmin>
        {/* Breadcrumb */}
        <Breadcrumb title="Admin Dashboard" />
        <AdminDashboard />
      </MasterLayoutadmin>
    </>
  );
};

export default AdminDashboardPage;
