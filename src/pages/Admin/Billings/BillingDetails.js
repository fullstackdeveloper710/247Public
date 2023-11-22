import { CurrentWalletIcon, textdot, visaicon } from "assets/images";
import Button from "components/Button";
import CustomModal from "components/CustomModal";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import UpdateCard from "stripe/UpdateCard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import moment from "moment";
import {
  currencyFormatter,
  dateFormat,
  subscriptionStatus,
  usersTypes,
} from "util/helpers";
import UpdateBillingAddress from "./UpdateAddress";
import { useSelector } from "react-redux";
import RechargeWallet from "../Wallet";
import { message } from "util/message";
import RenewSubscription from "./RenewSubscription";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const BillingDetails = ({ selectedPlan, address, cardDetail, fullName }) => {
  const [show, setShow] = useState(false);
  const [btnType, setBtnType] = useState("");
  const [showWallet, setShowWallet] = useState(false);

  //redux state
  const {
    userAuth: {
      user: { wallet_balance, is_subscribe, subscription_status, role },
      UserSubscriptionPlan: { plan_name },
    },
  } = useSelector((state) => state.app);

  //user roles
  const { postpaidRoot, billingAdmin } = usersTypes;

  //methods
  const handleShow = (e, type) => {
    setBtnType(type);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const rechargeWalletHandler = () => {
    setShowWallet(true);
  };

  const handleCloseWallet = () => {
    setShowWallet(false);
  };

  // variables with static values
  const card = cardDetail?.result;
  const updateCard = "updateCard";
  const updateAddress = "updateAddress";

  const getSubscriptionAction = (status) => {
    switch (subscriptionStatus[status]) {
      case subscriptionStatus.authentication_required:
        return (
          <RenewSubscription
            btnTitle="Authentication"
            confirmMsg={message.subsAuthPopUp}
            message={message.subsAuthRequired}
            auth={true}
          />
        );

      case subscriptionStatus.expired:
        return (
          <RenewSubscription
            btnTitle="Authentication"
            confirmMsg={message.subsAuthPopUp}
            message={message.subsAuthRequired}
            auth={true}
          />
          // <RenewSubscription
          //   btnTitle="Renew subscription plan"
          //   confirmMsg={message.subsExpired}
          //   message={message.subsExpired}
          // />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="billing">
        <div className="billing__header">
          <h2 className="mainTitle mb-0">Billing Information</h2>
          {role !== postpaidRoot && (
            <div className="wallet-section">
              <h2 className="mainTitle walletBal mb-0">
                <span>
                  <CurrentWalletIcon aria-hidden="true" focusable="false" />
                  Wallet balance :
                </span>
                <b>{currencyFormatter(wallet_balance)}</b>
              </h2>

              {is_subscribe && (
                <Button
                  title={"Recharge"}
                  className={"button--blue ms-auto"}
                  onClick={rechargeWalletHandler}
                />
              )}
            </div>
          )}
        </div>
        <div className="billing__content">
          <div className="planCard">
            <Row>
              <Col sm="12" md="12" lg="6">
                <div className="planCard__description text-uppercase">
                  <label>
                    YOUR {role === billingAdmin && "ORGANIZATION"} PLAN
                  </label>
                  <h3>{selectedPlan}</h3>
                  {!is_subscribe && (
                    <span className="desc_msg">
                      {subscriptionStatus?.authentication_required ===
                      subscription_status
                        ? message.subsAuthRequired(plan_name)
                        : subscriptionStatus.expired === subscription_status
                        ? message.subsExpired(plan_name)
                        : "please add your card details for subscription"}
                    </span>
                  )}
                  {/* {!is_subscribe && (
                    <span className="desc_msg">
                      please add your card details for subscription
                    </span>
                  )} */}
                  {card && card?.next_billing_date !== "" && (
                    <span>
                      Expire on -
                      <b>
                        {" " +
                          moment(card?.next_billing_date).format(dateFormat)}
                      </b>
                    </span>
                  )}
                </div>
              </Col>
              <Col sm="12" md="12" lg="6">
                <div className="planCard__buttons">
                  <Elements stripe={stripePromise}>
                    {getSubscriptionAction(subscription_status)}
                  </Elements>
                  <Button title={"View Plan"} className={"button--blue ms-3"} />
                </div>
              </Col>
            </Row>
          </div>

          {/* payment details */}
          {(card || address) && (
            <div className="paymentDetails mt-4">
              <Row>
                {card && (
                  <Col sm="6" md="12" lg="6">
                    <div className="paymentDetails__content">
                      <div className="d-flex">
                        <h3 className="me-2">Payment Details</h3>
                        <button
                          className="editlink"
                          onClick={(e) => handleShow(e, updateCard)}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="paymentDetails__descrp">
                        <span>
                          <img src={visaicon} alt="visaicon" />
                        </span>
                        <span>
                          <img src={textdot} alt="textdot" />
                        </span>
                        &nbsp;
                        <span>{card?.last4}</span>
                      </div>
                      {card?.next_billing_date !== "" && (
                        <p>
                          <b>
                            Next Billing on
                            {" " +
                              moment(card?.next_billing_date).format(
                                dateFormat
                              )}
                          </b>
                        </p>
                      )}
                    </div>
                  </Col>
                )}
                {address && (
                  <Col>
                    <div className="paymentDetails__billingcontent">
                      <h3 className="d-flex">Billing Name</h3>
                      <button
                        className="editlink"
                        onClick={(e) => handleShow(e, updateAddress)}
                      >
                        Edit
                      </button>
                      <div className="billingInfo">
                        <label>Full Name: </label>
                        <p>{fullName}</p>
                      </div>
                      <div className="billingInfo">
                        <label>Address: </label>
                        <p>
                          {address?.line1 ? address?.line1 + "," : ""}
                          {address?.line2 ? address?.line2 + "," : ""}
                          {address?.city ? address?.city + "," : ""}
                          {address?.state ? address?.state + "," : ""}
                          {address?.country ? address?.country + "," : ""}
                          {address?.postal_code
                            ? address?.postal_code + ","
                            : ""}
                        </p>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </div>
      </div>

      {/* These modals for update existing card and update billing address */}
      {btnType === updateCard ? (
        <CustomModal
          show={show}
          handleClose={handleClose}
          modalHeading="Update payment details"
          className="updatePaymentDetail"
        >
          <div className="customModalBody">
            <Elements stripe={stripePromise}>
              <UpdateCard handleClose={handleClose} />
            </Elements>
          </div>
        </CustomModal>
      ) : (
        <CustomModal
          show={show}
          handleClose={handleClose}
          modalHeading="Update billing address"
          className="updatePaymentDetail"
        >
          <div className="customModalBody">
            <UpdateBillingAddress address={address} handleClose={handleClose} />
          </div>
        </CustomModal>
      )}

      {/* This modal for recharge wallet */}
      <CustomModal
        children={
          <Elements stripe={stripePromise}>
            <RechargeWallet
              handleCloseWallet={handleCloseWallet}
              card_details={card}
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

export default BillingDetails;
