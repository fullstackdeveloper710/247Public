import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CurrentWalletIcon, DollarRounded } from "assets/images";
import Button from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import PaymentForm from "stripe/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CustomModal from "components/CustomModal";
import RechargeWallet from "pages/Admin/Wallet";
import { payWithWallet } from "redux/asyncApi/paymentApi";
import { orderInProcess } from "redux/asyncApi/orderApi";
import { getUsedMemory } from "redux/asyncApi/appApi";
import DescriptionList from "components/DescriptionList";
import { currencyFormatter } from "util/helpers";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const PaymentFile = ({ handleBack, handleNext }) => {
  const [paymentMethod, setPaymentMethod] = useState("Creditcard");
  const [showWallet, setShowWallet] = useState(false);

  //redux state
  const { uploadedFiles, orderInformationList } =
    useSelector((state) => state.upload) || {};

  const {
    userAuth: {
      token,
      user: { wallet_balance },
    },
  } = useSelector((state) => state.app) || {};

  const { balance_payable, address, card_details } = orderInformationList; //destructured values

  //redux action dispatcher
  const dispatch = useDispatch();

  //methods
  const rechargeWalletHandler = () => {
    setShowWallet(true);
  };

  const handleCloseWallet = () => {
    setShowWallet(false);
  };

  const payWithWalletHandler = () => {
    const values = {
      order_temp_id: uploadedFiles.order_temp_id,
    };
    dispatch(payWithWallet({ token, values })).then(({ payload }) => {
      if (payload.status) {
        handleNext();
        dispatch(orderInProcess(token));
        dispatch(getUsedMemory(token));
      }
    });
  };

  return (
    <>
      <div className="customCard payment_File_Block">
        <h2 className="mainTitle">Payment</h2>
        <div className="form-area mt-4">
          <Row>
            <Col md={12}>
              <div className="radioButtonGroup d-flex align-items-start">
                <div className="customCheckbox radioButton">
                  <input
                    type="radio"
                    id="Creditcard"
                    name="card-group"
                    checked={paymentMethod === "Creditcard" && true}
                    onChange={(e) => setPaymentMethod(e.target.id)}
                  />
                  <label htmlFor="Creditcard">Pay with Credit Card</label>
                </div>

                <div className="customCheckbox radioButton ms-4">
                  <input
                    type="radio"
                    id="bywallet"
                    name="card-group"
                    onChange={(e) => setPaymentMethod(e.target.id)}
                  />
                  <label htmlFor="bywallet">Pay with Wallet</label>
                </div>
              </div>
            </Col>
          </Row>

          {paymentMethod === "Creditcard" ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={balance_payable}
                handleBack={handleBack}
                handleNext={handleNext}
                address={address}
                order_temp_id={uploadedFiles?.order_temp_id}
              />
            </Elements>
          ) : (
            <div className="WalletPay mt-5">
              <Row>
                {+wallet_balance < +balance_payable && (
                  <Col md={12}>
                    <span className="error-msg mb-4">
                      Please Note that your <b> payable amount</b> is more than{" "}
                      <b>Current wallet Amount</b>. Firstly <b>ADD</b> more
                      amount in wallet.
                    </span>
                  </Col>
                )}
                <Col md={"12"}>
                  <div className="walletCard-Wrapper mb-4">
                    <Row className="align-items-center">
                      <Col lg={"8"}>
                        <div className="walletCardinner d-flex align-items-start">
                          <div className="walletCard walletCard-1 d-flex align-items-center">
                            <span className="wcardIcon">
                              <CurrentWalletIcon
                                aria-hidden="true"
                                focusable="false"
                              />
                            </span>
                            <DescriptionList
                              className="wcardPrice"
                              dt="Current Wallet Balance"
                              dd={currencyFormatter(wallet_balance)}
                              ddClass={
                                +wallet_balance < +balance_payable &&
                                "error_color"
                              }
                            />
                          </div>

                          <div className="walletCard walletCard-2 d-flex align-items-center ms-5 ps-5 amount-success">
                            <span className="wcardIcon">
                              <DollarRounded
                                aria-hidden="true"
                                focusable="false"
                              />
                            </span>
                            <DescriptionList
                              className="wcardPrice"
                              dt="Payable Amount"
                              dd={currencyFormatter(balance_payable)}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col lg={"4"}>
                        <Button
                          title={"Add Credit To  Wallet"}
                          className={"button--blue ms-auto"}
                          onClick={rechargeWalletHandler}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <Row>
            {/* <Col md={12}>
              <div className="inputRow ">
                <div className="customCheckbox d-flex align-items-center">
                  <input type="checkbox" id="confirm-accessibility" name="" />
                  <label htmlFor="confirm-accessibility" className="mt-0 mb-0 ">
                    Please confirm that you would like 247 Accessibility Documents
                    to change the font color to meet color contrast ratio as
                    specified under WCAG 2.0 - Level AA compliance.
                  </label>
                </div>
              </div>
            </Col> */}

            <Col md={12}>
              {/* <div className="acc_note">
              <h4>Note:</h4>
              <p>Based on Type of user and volume - Rates will vary.</p>
              <p>
                If you have used background or layered images, 247 Accessible
                Documents would be unable to manipulate them.
              </p>
            </div> */}
            </Col>
          </Row>
        </div>
        <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
          {paymentMethod !== "Creditcard" && (
            <>
              <Button
                title={"Back"}
                className={"button--border"}
                onClick={() => handleBack()}
              />
              <Button
                title={"Make Payment"}
                className={"button--blue ms-3"}
                onClick={payWithWalletHandler}
              />
            </>
          )}
        </div>
      </div>

      <CustomModal
        children={
          <Elements stripe={stripePromise}>
            <RechargeWallet
              handleCloseWallet={handleCloseWallet}
              card_details={card_details}
              wallet_balance={wallet_balance}
            />
          </Elements>
        }
        show={showWallet}
        handleClose={handleCloseWallet}
        modalHeading={"Recharge wallet"}
        className="ApprovalModal"
      />
    </>
  );
};

export default PaymentFile;
