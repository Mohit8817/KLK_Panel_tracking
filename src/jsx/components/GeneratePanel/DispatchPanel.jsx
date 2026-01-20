import React, { Fragment, useState } from "react";
import PageTitle from "../../layouts/PageTitle";

const DispatchPanel = () => {
  const [dispatchData, setDispatchData] = useState({
    state: "",
    truckNo: "",
    driverNo: "",
    driverName: "",
  });

  const handleChange = (e) => {
    setDispatchData({
      ...dispatchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dispatch Data:", dispatchData);
    alert("Dispatch details saved successfully");
  };

  return (
    <Fragment>
      <PageTitle
        activeMenu="Dispatch Panel"
        motherMenu="Panel Management"
        pageContent="Panel Dispatch"
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Panel Dispatch Details</h4>
            </div>

            <div className="card-body">
              <form className="form-valide" onSubmit={handleSubmit}>
                <div className="row">

                  {/* State */}
                  <div className="col-xl-6 col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        placeholder="Enter state"
                        value={dispatchData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Truck No */}
                  <div className="col-xl-6 col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Truck No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="truckNo"
                        placeholder="RJ14 AB 1234"
                        value={dispatchData.truckNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Driver No */}
                  <div className="col-xl-6 col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Driver No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="driverNo"
                        placeholder="Driver mobile number"
                        value={dispatchData.driverNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Driver Name */}
                  <div className="col-xl-6 col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Driver Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="driverName"
                        placeholder="Enter driver name"
                        value={dispatchData.driverName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="row mt-3">
                  <div className="col-lg-12 text-center">
                    <button type="submit" className="btn btn-success px-4">
                      Save Dispatch Details
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DispatchPanel;
