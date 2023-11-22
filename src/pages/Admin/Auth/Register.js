import { ArrowRight, SiteLogo } from "assets/images";
import Button from "components/Button";
import Checkbox from "components/Checkbox/Checkbox";
import PlanCard from "components/PlanCard";
import Input from "components/inputField";
import { REGISTER_TITLE } from "constants/title";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "redux/Slices/appSlice";
import { register } from "redux/asyncApi/appApi";
import { ROUTES } from "routes/constant";
import {
  basicEmailValidation,
  nameValidation,
  passwordValidation,
} from "util/helpers";
import { contact_us, term_and_conditions } from "util/links";
import { validationMsg } from "util/validationErrors";
import ContactUsForm from "./ContactUsForm";
import CustomModal from "components/CustomModal";

const Register = () => {
  document.title = REGISTER_TITLE;
  const { error } = useSelector((state) => state.app);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    registerplan: "",
    termsAndConditions: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const termsRef = useRef();
  const companyNameRef = useRef();
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const {
    fNameReq,
    lNameReq,
    emailReq,
    companyReq,
    passReq,
    confirmPassReq,
    tAndConReq,
    validEmail,
    validFname,
    validLname,
    validCofirmPass,
  } = validationMsg;

  useEffect(() => {
    firstNameRef.current.focus();
  }, []);

  useEffect(() => {
    if (error?.message) {
      setFormErrors({ ...formErrors, email: error?.message });
      emailRef.current.focus();
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [error?.message]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        confirm_password: formData.confirmPassword,
        company_name: formData.companyName,
        org_subscription_plan_id: +selectedPlan,
        terms_and_conditions: formData.termsAndConditions,
        password: formData.password,
        email: formData.email,
      };
      const name = formData.firstName.concat(" ", formData.lastName);
      dispatch(register(values)).then(({ payload }) => {
        if (payload.status) {
          navigate(ROUTES.REGISTER_VERIFICATION.replace(/:name/g, name));
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const validateForm = (values) => {
    const errors = {};
    if (!values.termsAndConditions) {
      errors.termsAndConditions = tAndConReq;
      termsRef.current.focus();
    }
    if (values.confirmPassword === "") {
      errors.confirmPassword = confirmPassReq;
      confirmPasswordRef.current.focus();
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = validCofirmPass;
      confirmPasswordRef.current.focus();
    }
    if (values.password === "") {
      errors.password = passReq;
      passwordRef.current.focus();
    }
    if (values.email === "") {
      errors.email = emailReq;
      emailRef.current.focus();
    } else if (basicEmailValidation(values.email)) {
      errors.email = validEmail;
      emailRef.current.focus();
    }
    if (values.companyName === "") {
      errors.companyName = companyReq;
      companyNameRef.current.focus();
    }
    if (values.lastName === "") {
      errors.lastName = lNameReq;
      lastNameRef.current.focus();
    } else if (!nameValidation(values.lastName)) {
      errors.lastName = validLname;
      lastNameRef.current.focus();
    }
    if (values.firstName === "") {
      errors.firstName = fNameReq;
      firstNameRef.current.focus();
    } else if (!nameValidation(values.firstName)) {
      errors.firstName = validFname;
      firstNameRef.current.focus();
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };

  const onInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "radio" && checked) {
      setSelectedPlan(value);
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: name === "termsAndConditions" ? checked : value,
        };
      });
    }
  };

  const onKeyDownHandler = (e, value) => {
    const { code } = e;
    if (code === "Enter" || code === "Space") {
      setSelectedPlan(value);
    }
  };

  const contactUsHandler = () => {
    handleShow();
  };

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    companyName,
    termsAndConditions,
    registerplan,
  } = formData;

  const subscriptionPlans = [
    {
      disabled: false,
      id: "free",
      name: "registerplan",
      value: "1",
      legend: "Pay-as-you-go",
      cardHeading: "Only For One Person",
      planPrice: "$0",
      duration: "",
      checked: selectedPlan === "1",
      contactUsLink: false,
      ckeckIcon: true,
    },
    {
      id: "premium",
      name: "registerplan",
      legend: "Premium",
      value: "2",
      cardHeading: "Up to 50 users",
      planPrice: "$299",
      duration: "per year",
      checked: selectedPlan === "2",
      ckeckIcon: true,
      // disabled: true,
      // commingSoon: true,
      // contactUsLink: contact_us,
    },
    {
      id: "enterprise",
      name: "registerplan",
      value: "3",
      checked: selectedPlan === "3",
      legend: "Enterprise",
      cardHeading: "Best for you company unlimited",
      planPrice: "$500",
      duration: "per year",
      ckeckIcon: true,
      disabled: true,
      commingSoon: true,
      // contactUsLink: contact_us,
      ConactUsBtn: (
        <Button
          title={"Contact Sales"}
          className={"button--blue ms-3 "}
          onClick={contactUsHandler}
        />
      ),
    },
  ];
  return (
    <>
      <div className="auth">
        <div className="auth__Wrapper auth__RegisterWrapper">
          <div className="auth__dialog">
            <div className="auth__inner">
              <div className="auth__header">
                <SiteLogo />
                <div className="auth__header__info">
                  <h1>Registration</h1>
                  <p>No Credit Card Required. All fields are mandatory.</p>
                </div>
              </div>

              <div className="auth__body">
                <Row>
                  <Col md="6" lg="6">
                    <Input
                      type="text"
                      autoComplete="first-name"
                      label="First Name:"
                      required={false}
                      ref={firstNameRef}
                      ErrorLabel={
                        formErrors.firstName ? "Fist_Name_Error" : null
                      }
                      forLabel={"Fist_Name"}
                      name="firstName"
                      value={firstName}
                      error={formErrors.firstName ? true : false}
                      errorMsg={formErrors.firstName}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col md="6" lg="6">
                    <Input
                      type="text"
                      autoComplete="last-name"
                      label="Last Name:"
                      required={false}
                      ref={lastNameRef}
                      ErrorLabel={
                        formErrors.lastName ? "Last_Name_Error" : null
                      }
                      forLabel={"Last_Name"}
                      name="lastName"
                      value={lastName}
                      error={formErrors.lastName ? true : false}
                      errorMsg={formErrors.lastName}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col md="6" lg="6">
                    <Input
                      type="text"
                      autoComplete="organization"
                      label="Company Name:"
                      required={false}
                      ref={companyNameRef}
                      ErrorLabel={
                        formErrors.companyName ? "Password_Error" : null
                      }
                      forLabel={"conpanyName"}
                      name="companyName"
                      value={companyName}
                      error={formErrors.companyName ? true : false}
                      errorMsg={formErrors.companyName}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col md="6" lg="6">
                    <Input
                      type="email"
                      autoComplete="email"
                      label="Email:"
                      required={false}
                      ref={emailRef}
                      ErrorLabel={formErrors.email ? "Email_Error" : null}
                      forLabel={"Email"}
                      name="email"
                      value={email}
                      error={formErrors.email ? true : false}
                      errorMsg={formErrors.email}
                      onInputChange={onInputChange}
                    />
                  </Col>{" "}
                  <Col md="6" lg="6">
                    <Input
                      type="password"
                      autoComplete="off"
                      label="Password:"
                      required={false}
                      ref={passwordRef}
                      ErrorLabel={formErrors.password ? "Password_Error" : null}
                      forLabel={"password"}
                      name="password"
                      value={password}
                      error={formErrors.password ? true : false}
                      errorMsg={formErrors.password}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col md="6" lg="6">
                    <Input
                      type="password"
                      autoComplete="off"
                      label="Confirm Password:"
                      required={false}
                      ref={confirmPasswordRef}
                      ErrorLabel={
                        formErrors.confirmPassword
                          ? "Confirm_Password_Error"
                          : null
                      }
                      forLabel={"Confirm_Password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      error={formErrors.confirmPassword ? true : false}
                      errorMsg={formErrors.confirmPassword}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col md="12" lg="12">
                    <div className="registerPlan">
                      <PlanCard
                        plans={subscriptionPlans}
                        onChange={onInputChange}
                      />
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="auth__checkbx">
                      <Checkbox
                        type="checkbox"
                        id="contrast_Checkbox"
                        name="termsAndConditions"
                        checked={termsAndConditions}
                        onChange={onInputChange}
                        ref={termsRef}
                        ErrorLabel={
                          formErrors?.termsAndConditions
                            ? "Terms_An_Conditions_Error"
                            : null
                        }
                        link={
                          <a target="_blank" href={term_and_conditions}>
                            Accept Terms and Conditions
                          </a>
                        }
                        label="Accept Terms and Conditions"
                        error={formErrors?.termsAndConditions}
                      />
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="auth__buttons">
                      <Button
                        title={"Continue"}
                        className={"button--blue"}
                        icon={
                          <ArrowRight aria-hidden="true" focusable="false" />
                        }
                        onClick={onSubmitHandler}
                      />
                    </div>
                    <div className="authLinks">
                      <span>
                        Already a Member?
                        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <p className="auth__footer">
            © 2023 247 Accessible Documents Pte. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>

      <CustomModal
        show={show}
        handleClose={handleClose}
        modalHeading=""
        className="ContactUsModal"
      >
        <div className="customModalBody">
          <ContactUsForm handleClose={handleClose} />
        </div>
      </CustomModal>
    </>
  );
};

export default Register;
