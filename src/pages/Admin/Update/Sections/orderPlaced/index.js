import { OrderSuccess } from "assets/images";
import React from "react";

const OrderPlaced = () => {
  return (
    <div className="customCard orderBlock">
      <div className="orderSuccessful">
        <figure className="success-icon">
          <OrderSuccess aria-hidden="true" focusable="false" />
        </figure>
        <h2>Order Successful</h2>
        <span>Request sent for approval</span>
        <p>Sent order to your administrator.</p>
      </div>
      <div className="form-buttons d-flex align-items-center justify-content-end pt-4"></div>
    </div>
  );
};

export default OrderPlaced;
