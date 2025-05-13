import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const EarningStaticOne = () => {
  // Revenue Data
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/ownerdashboard/ownerdashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        const data = await response.json();
  
        // check if `data.revenues` exists and is an array
        if (!Array.isArray(data.revenues)) {
          console.error("API response is not in expected format:", data);
          throw new Error("Unexpected response format");
        }
  
        const total = data.revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
        setRevenueData(data.revenues);
        setTotalRevenue(total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRevenueData();
  }, []);
  

  if (loading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-xxl-12">
      <div className="card p-4 shadow-2 radius-8 border input-form-light h-100">
        <div className="card-body p-0">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="fw-bold text-lg">
              <Icon icon="iconamoon:discount-fill" className="me-2 text-warning" />
              Revenue Data
            </h6>
            <span className="badge bg-success text-white px-3 py-2 fs-6">
              Total:{totalRevenue.toFixed(2)}  DTN 
            </span>
          </div>

          {/* Revenue Items */}
          <div className="row g-3">
            {revenueData.length > 0 ? (
              revenueData.map((revenue) => (
                <div key={revenue._id} className="col-md-4">
                  <div className="card p-3 shadow-sm radius-8 border h-100">
                    <div className="d-flex align-items-center gap-3">
                      <Icon icon="iconamoon:money-bill-fill" className="text-success fs-2" />
                      <div>
                        <h6 className="fw-semibold mb-1"><Icon icon="iconamoon:money-bill-fill" className="text-success fs-2" />{revenue.amount} DTN </h6>
                        <span className="text-muted small">
                          {new Date(revenue.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-secondary mt-2 mb-0">
                      <strong>Source:</strong> {revenue.source}
                    </p>
                    <p className="text-sm text-secondary mb-0">
                      <strong>Description:</strong> {revenue.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No revenue data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningStaticOne;
