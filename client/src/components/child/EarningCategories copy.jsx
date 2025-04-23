import React from "react";
import { Link } from "react-router-dom";

const EarningCategories = () => {
  return (
    <div className='col-md-6'>
      <div className='card radius-16 h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Expense Categories</h6>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex flex-column gap-20'>

            {/* Software & Tools */}
            <div className='d-flex align-items-center justify-content-between gap-3'>
              <div className='d-flex align-items-center w-100 gap-12'>
                <span className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-primary-100'>
                  <img
                    src='assets/images/home-eleven/icons/earn-cat-icon1.svg'
                    alt=''
                  />
                </span>
                <div className='flex-grow-1'>
                  <h6 className='text-sm mb-0'> Software & Tools</h6>
                  <span className='text-xs text-secondary-light fw-medium'>
                    300 DT / from 1000 DT
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center gap-2 w-100'>
                <div className='w-100 max-w-66 ms-auto'>
                  <div
                    className='progress progress-sm rounded-pill'
                    role='progressbar'
                    aria-valuenow={30}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className='progress-bar bg-primary-600 rounded-pill'
                      style={{ width: "30%" }}
                    />
                  </div>
                </div>
                <span className='text-secondary-light font-xs fw-semibold'>
                  30%
                </span>
              </div>
            </div>

            {/* Office & Infrastructure */}
            <div className='d-flex align-items-center justify-content-between gap-3'>
              <div className='d-flex align-items-center w-100 gap-12'>
                <span className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-danger-100'>
                  <img
                    src='assets/images/home-eleven/icons/earn-cat-icon2.svg'
                    alt=''
                  />
                </span>
                <div className='flex-grow-1'>
                  <h6 className='text-sm mb-0'>Office & Infrastructure</h6>
                  <span className='text-xs text-secondary-light fw-medium'>
                    500 DT / from 1500 DT
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center gap-2 w-100'>
                <div className='w-100 max-w-66 ms-auto'>
                  <div
                    className='progress progress-sm rounded-pill'
                    role='progressbar'
                    aria-valuenow={33}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className='progress-bar bg-orange rounded-pill'
                      style={{ width: "33%" }}
                    />
                  </div>
                </div>
                <span className='text-secondary-light font-xs fw-semibold'>
                  33%
                </span>
              </div>
            </div>

            {/* Marketing & Advertising */}
            <div className='d-flex align-items-center justify-content-between gap-3'>
              <div className='d-flex align-items-center w-100 gap-12'>
                <span className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-warning-200'>
                  <img
                    src='assets/images/home-eleven/icons/earn-cat-icon3.svg'
                    alt=''
                  />
                </span>
                <div className='flex-grow-1'>
                  <h6 className='text-sm mb-0'>Marketing & Advertising</h6>
                  <span className='text-xs text-secondary-light fw-medium'>
                    1200 DT / from 2000 DT
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center gap-2 w-100'>
                <div className='w-100 max-w-66 ms-auto'>
                  <div
                    className='progress progress-sm rounded-pill'
                    role='progressbar'
                    aria-valuenow={60}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className='progress-bar bg-yellow rounded-pill'
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
                <span className='text-secondary-light font-xs fw-semibold'>
                  60%
                </span>
              </div>
            </div>

            {/* Salaries & Freelancers */}
            <div className='d-flex align-items-center justify-content-between gap-3'>
              <div className='d-flex align-items-center w-100 gap-12'>
                <span className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-success-200'>
                  <img
                    src='assets/images/home-eleven/icons/earn-cat-icon4.svg'
                    alt=''
                  />
                </span>
                <div className='flex-grow-1'>
                  <h6 className='text-sm mb-0'>Salaries & Freelancers</h6>
                  <span className='text-xs text-secondary-light fw-medium'>
                    4000 DT / from 5000 DT
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center gap-2 w-100'>
                <div className='w-100 max-w-66 ms-auto'>
                  <div
                    className='progress progress-sm rounded-pill'
                    role='progressbar'
                    aria-valuenow={80}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className='progress-bar bg-success-main rounded-pill'
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
                <span className='text-secondary-light font-xs fw-semibold'>
                  80%
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningCategories;
