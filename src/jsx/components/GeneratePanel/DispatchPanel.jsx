import React, { Fragment, useState, useRef, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import jsQR from "jsqr";

const DispatchPanel = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const [dispatchData, setDispatchData] = useState({
    state: "",
    truckNo: "",
    driverNo: "",
    driverName: "",
    dispatchType: "DCR",
    dcrNumber: "",
    nonDcrReason: "",
    scanFile: "",
    paymentInfo: "",
    isCompleted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDispatchData({
      ...dispatchData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isPaymentQR = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      lower.startsWith("upi://") ||
      lower.includes("paytm.com") ||
      lower.includes("phonepe") ||
      lower.includes("alipay.com") ||
      lower.includes("wechat.com") ||
      lower.includes("pay")
    );
  };

  const startScan = async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      videoRef.current.setAttribute("playsinline", true); // for iOS
      await videoRef.current.play();
      requestAnimationFrame(tick);
    } catch (err) {
      alert("Camera access error: " + err);
      setScanning(false);
    }
  };

  const stopScan = () => {
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const tick = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      if (scanning) requestAnimationFrame(tick);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      // QR code detected
      setDispatchData((prev) => {
        const newData = { ...prev, scanFile: code.data };
        if (prev.dispatchType === "DCR") {
          newData.dcrNumber = code.data;
        } else if (prev.dispatchType === "NON_DCR") {
          newData.nonDcrReason = code.data;
        }
        if (isPaymentQR(code.data)) {
          newData.paymentInfo = code.data;
        }
        return newData;
      });
      stopScan();
    } else if (scanning) {
      requestAnimationFrame(tick);
    }
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
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={dispatchData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Truck No *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="truckNo"
                      value={dispatchData.truckNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Driver No *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="driverNo"
                      value={dispatchData.driverNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Driver Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="driverName"
                      value={dispatchData.driverName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Dispatch Type *</label>
                    <div className="d-flex gap-3">
                      <label className="btn btn-outline-primary">
                        <input
                          type="radio"
                          name="dispatchType"
                          value="DCR"
                          checked={dispatchData.dispatchType === "DCR"}
                          onChange={handleChange}
                          hidden
                        />
                        DCR
                      </label>
                      <label className="btn btn-outline-danger">
                        <input
                          type="radio"
                          name="dispatchType"
                          value="NON_DCR"
                          checked={dispatchData.dispatchType === "NON_DCR"}
                          onChange={handleChange}
                          hidden
                        />
                        Non DCR
                      </label>
                    </div>
                  </div>
                  {dispatchData.dispatchType === "DCR" && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">DCR Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dcrNumber"
                        value={dispatchData.dcrNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  {dispatchData.dispatchType === "NON_DCR" && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Reason *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nonDcrReason"
                        value={dispatchData.nonDcrReason}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Scan QR Code</label>
                    {!scanning && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={startScan}
                      >
                        Scan QR
                      </button>
                    )}
                    {scanning && (
                      <>
                        <video ref={videoRef} style={{ width: "100%" }} />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        <button
                          type="button"
                          className="btn btn-danger mt-2"
                          onClick={stopScan}
                        >
                          Stop Scan
                        </button>
                      </>
                    )}
                    {dispatchData.scanFile && (
                      <div className="alert alert-success mt-2">
                        Scanned: {dispatchData.scanFile}
                      </div>
                    )}
                    {dispatchData.paymentInfo && (
                      <div className="alert alert-info mt-2">
                        Payment QR Detected: {dispatchData.paymentInfo}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3 d-flex align-items-center">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isCompleted"
                        checked={dispatchData.isCompleted}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Dispatch Completed</label>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-success px-4">
                    Save Dispatch Details
                  </button>
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
