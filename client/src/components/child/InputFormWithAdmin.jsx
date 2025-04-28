import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { FaCalculator } from "react-icons/fa";

const InputFormWithAdmin = () => {
  const [taxRuleData, setTaxRuleData] = useState({
    taxType: "",
    rate: "",
    applicableCategories: "",
    maxConsumption: "",
    isExportCondition: false,
  });

  const [taxRuleErrors, setTaxRuleErrors] = useState({
    taxType: "",
    rate: "",
    applicableCategories: "",
    maxConsumption: "",
  });

  const { taxType, rate, applicableCategories, maxConsumption, isExportCondition } = taxRuleData;

  const validateTaxRuleForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!taxType) {
      tempErrors.taxType = "Tax type is required";
      isValid = false;
    }

    if (!rate) {
      tempErrors.rate = "Rate is required";
      isValid = false;
    } else if (isNaN(rate) || rate <= 0 || rate > 1) {
      tempErrors.rate = "Rate must be a number between 0 and 1 (e.g., 0.19 for 19%)";
      isValid = false;
    }

    if (!applicableCategories.trim()) {
      tempErrors.applicableCategories = "At least one category is required";
      isValid = false;
    } else if (!applicableCategories.split(',').every(cat => cat.trim().length > 0)) {
      tempErrors.applicableCategories = "Categories must be non-empty and separated by commas";
      isValid = false;
    }

    if (taxType === "TVA" && maxConsumption && (isNaN(maxConsumption) || maxConsumption <= 0)) {
      tempErrors.maxConsumption = "Max consumption must be a positive number";
      isValid = false;
    }

    setTaxRuleErrors(tempErrors);
    return isValid;
  };

  const onTaxRuleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaxRuleData({
      ...taxRuleData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (taxRuleErrors[name]) {
      setTaxRuleErrors({ ...taxRuleErrors, [name]: "" });
    }
  };

  const onTaxRuleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTaxRuleForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    const categoriesArray = applicableCategories.split(',').map(cat => cat.trim());
    const conditions = {};
    if (taxType === 'TVA' && maxConsumption) {
      conditions.maxConsumption = parseFloat(maxConsumption);
    }
    if (taxType === 'IS') {
      conditions.isExport = isExportCondition;
    }

    const payload = {
      taxType,
      rate: parseFloat(rate),
      applicableCategories: categoriesArray,
      conditions,
    };
    console.log('Payload envoyé pour ajout de règle:', payload);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/taxRules/add',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Réponse serveur:', response.data);

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Tax rule added successfully!',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });

      setTaxRuleData({
        taxType: "",
        rate: "",
        applicableCategories: "",
        maxConsumption: "",
        isExportCondition: false,
      });
      setTaxRuleErrors({});
    } catch (error) {
      console.error('Erreur Axios (ajout règle):', error.response);
      toast.error(
        error.response ? error.response.data.message : "Failed to add tax rule. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0 flex items-center gap-2">
            <FaCalculator /> Add a Tax Rule
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={onTaxRuleSubmit}>
            <div className="row gy-3">
              <div className="col-12">
                <label className="form-label">Tax Type</label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="mdi:tax" />
                  </span>
                  <select
                    name="taxType"
                    value={taxType}
                    onChange={onTaxRuleChange}
                    className={`form-control ${taxRuleErrors.taxType ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select a tax type</option>
                    <option value="TVA">TVA</option>
                    <option value="IS">IS</option>
                    <option value="SSC">SSC</option>
                  </select>
                  {taxRuleErrors.taxType && (
                    <div className="invalid-feedback">{taxRuleErrors.taxType}</div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Rate (e.g., 0.19 for 19%)</label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="mdi:percent" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="rate"
                    className={`form-control ${taxRuleErrors.rate ? 'is-invalid' : ''}`}
                    placeholder="Tax rate (e.g., 0.19)"
                    value={rate}
                    onChange={onTaxRuleChange}
                  />
                  {taxRuleErrors.rate && (
                    <div className="invalid-feedback">{taxRuleErrors.rate}</div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Applicable Categories (comma-separated)</label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="mdi:category" />
                  </span>
                  <input
                    type="text"
                    name="applicableCategories"
                    className={`form-control ${taxRuleErrors.applicableCategories ? 'is-invalid' : ''}`}
                    placeholder="e.g., Sales,Grocery"
                    value={applicableCategories}
                    onChange={onTaxRuleChange}
                  />
                  {taxRuleErrors.applicableCategories && (
                    <div className="invalid-feedback">{taxRuleErrors.applicableCategories}</div>
                  )}
                </div>
              </div>
              {taxType === "TVA" && (
                <div className="col-12">
                  <label className="form-label">Max Consumption (kWh, optional)</label>
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="mdi:lightning-bolt" />
                    </span>
                    <input
                      type="number"
                      name="maxConsumption"
                      className={`form-control ${taxRuleErrors.maxConsumption ? 'is-invalid' : ''}`}
                      placeholder="Max consumption (kWh)"
                      value={maxConsumption}
                      onChange={onTaxRuleChange}
                    />
                    {taxRuleErrors.maxConsumption && (
                      <div className="invalid-feedback">{taxRuleErrors.maxConsumption}</div>
                    )}
                  </div>
                </div>
              )}
              {taxType === "IS" && (
                <div className="col-12">
                  <label className="form-label d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name="isExportCondition"
                      checked={isExportCondition}
                      onChange={onTaxRuleChange}
                    />
                    Export Condition (IS 10%)
                  </label>
                </div>
              )}
              <div className="col-12 flex gap-3">
                <button type="submit" className="btn btn-primary-600 w-50">
                  Add Tax Rule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaxRuleData({
                      taxType: "",
                      rate: "",
                      applicableCategories: "",
                      maxConsumption: "",
                      isExportCondition: false,
                    });
                    setTaxRuleErrors({});
                  }}
                  className="btn btn-secondary w-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputFormWithAdmin;