import { useStripe } from "@stripe/react-stripe-js";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";
import PlanCard from "components/PlanCard";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reset } from "redux/Slices/appSlice";
import {
  subscriptionChange,
  updateSubscription,
} from "redux/asyncApi/paymentApi";
import Subscription from "stripe/Subscription";
import { planTypes, subscriptionStatus, usersTypes } from "util/helpers";
import { contact_us } from "util/links";
import RenewSubscription from "./RenewSubscription";
import { message } from "util/message";
import ContactUsForm from "../Auth/ContactUsForm";
import CustomModal from "components/CustomModal";
import Button from "components/Button";

const SubscriptionPlans = ({ showElements }) => {
  const [show, setShow] = useState(false);
  const [openContactUsModal, setContactUsModal] = useState(false);

  const {
    userAuth: { token, user: UserDetails, UserSubscriptionPlan },
  } = useSelector((state) => state.app) || {};
  const [selectedPlan, setSelectedPlan] = useState(UserSubscriptionPlan?.id);

  const { billingInfo, cardDetail } =
    useSelector((state) => state.payment) || {};
  const {
    result: { address },
  } = billingInfo || {};
  const dispatch = useDispatch();
  const { postpaidRoot } = usersTypes;

  const stripe = useStripe();

  const card = cardDetail?.result;

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleContactUsClose = () => {
    setContactUsModal(false);
  };
  const handleContactUsShow = () => setContactUsModal(true);

  const onConfirmHandler = () => {
    const values = {
      plan_id: selectedPlan,
    };
    dispatch(updateSubscription({ values, token })).then(
      async ({ payload }) => {
        if (payload.response.status === "requires_action") {
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            payload.response.client_secret
          );

          if (!error) {
            const values = {
              paymentintent_id: paymentIntent.id,
            };

            switch (paymentIntent.status) {
              case "succeeded":
                dispatch(
                  subscriptionChange({
                    token,
                    values,
                  })
                ).then(({ payload }) => {
                  if (payload.status) {
                    dispatch(
                      reset(
                        "Congratulations your subscription plan has been Upgraded! Please login again."
                      )
                    );
                  }
                });

                break;
              case "processing":
                toast.info(message.paymentUnderProccess);
                dispatch(
                  subscriptionChange({
                    token,
                    values,
                  })
                );
                break;
              case "requires_payment_method":
                toast.error(
                  "Your payment was not successful, please try again."
                );
                dispatch(
                  subscriptionChange({
                    token,
                    values,
                  })
                );
                break;
              default:
                toast.error("Something went wrong.");
                dispatch(
                  subscriptionChange({
                    token,
                    values,
                  })
                );
                break;
            }
          } else {
            dispatch(
              subscriptionChange({
                token,
                values: {
                  paymentintent_id: error?.payment_intent?.id,
                },
              })
            );
          }
        } else {
          if (payload.status) {
            dispatch(
              reset(
                "Congratulations your subscription plan has been Upgraded! Please login again."
              )
            );
          }
        }
      }
    );
  };

  const onInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "radio" && checked) {
      setSelectedPlan(+value);
      if (+value !== id && card) {
        handleShow();
      }
    }
  };

  const onKeyDownHandler = (e, value) => {
    const { code } = e;
    if (code === "Enter" || code === "Space") {
      setSelectedPlan(value);
    }
  };

  const { Free, Premium, Enterprise, Postpaid } = planTypes;
  const { id } = UserSubscriptionPlan || {};
  const { subscription_expired, subscription_status } = UserDetails || {};

  const contactUsHandler = () => {
    handleContactUsShow();
  };

  const subscriptionPlans = [
    {
      disabled: id === 2 || id === 3 || id === 4,
      id: "1",
      name: "registerplan",
      value: Free,
      legend: "Pay-as-you-go",
      cardHeading: "Only For One Person",
      planPrice: "$0",
      duration: "",
      checked: selectedPlan === Free,
      // contactUsLink: false,
      // current: id === Free,
    },
    {
      disabled: id === 3 || id === 4,
      id: "2",
      nam: "registerplan",
      legend: "Premium",
      value: Premium,
      cardHeading: "Up to 50 users",
      planPrice: "$299",
      duration: "per year",
      checked: selectedPlan === Premium,
      current: id === Premium,
      // disabled: true,
      // commingSoon: true,
      // contactUsLink: contact_us,
    },
    {
      disabled: id === 4,
      id: "3",
      name: "registerplan",
      value: Enterprise,
      checked: selectedPlan === Enterprise,
      legend: "Enterprise",
      cardHeading: "Best for you company unlimited",
      planPrice: "$500",
      duration: "per year",
      current: id === Enterprise,
      disabled: true,
      commingSoon: true,
      // contactUsLink: contact_us,
      ConactUsBtn: (
        <Button
          title={"Contact Sales"}
          className={"button--blue ms-3"}
          onClick={contactUsHandler}
        />
      ),
    },
  ];

  UserDetails?.role === postpaidRoot &&
    subscriptionPlans.push({
      id: "4",
      name: "registerplan",
      value: Postpaid,
      legend: "Postpaid",
      cardHeading: "Up to 30 people can use",
      planPrice: "Billing",
      duration: "",
      checked: selectedPlan === Postpaid,
      contactUsLink: false,
      current: id === Postpaid,
    });

  return (
    <>
      <div className="subscription">
        <PlanCard plans={subscriptionPlans} onChange={onInputChange} />
        <Row>
          {/* user_subscriptiontype_id */}
          {selectedPlan !== Free &&
          selectedPlan !== Postpaid &&
          !card &&
          showElements ? (
            <Col md="12">
              <div className="cardDetailForm">
                <h2 className="mainTitle mb-0">Enter Card details</h2>
                <Subscription address={address} planId={selectedPlan} />
              </div>
            </Col>
          ) : null}
        </Row>
      </div>
      <ConfirmPopUp
        // Icon={Trash3}
        heading="confirmation"
        confirmMsg={`Are you sure to upgrade your subscription?
        Once you upgrade your subscription you will not be able to downgrade it.`}
        show={show}
        handleClose={handleClose}
        onConfirmHandler={onConfirmHandler}
      />

      <CustomModal
        show={openContactUsModal}
        handleClose={handleContactUsClose}
        modalHeading=""
        className="ContactUsModal"
      >
        <div className="customModalBody">
          <ContactUsForm handleClose={handleContactUsClose} />
        </div>
      </CustomModal>
    </>
  );
};

export default SubscriptionPlans;
