import { SiteLogo } from "assets/images";
import Button from "components/Button";
import Input from "components/inputField";
import TextArea from "components/inputField/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { sendUserContactInfo } from "redux/asyncApi/appApi";
import { basicEmailValidation, nameValidation } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const ContactUsForm = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    commentMsg: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const { firstName, lastName, email, companyName, commentMsg } = formData;

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Ref
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const companyNameRef = useRef();
  const messageRef = useRef();

  //Validation error messages
  const {
    fNameReq,
    lNameReq,
    emailReq,
    companyReq,
    validEmail,
    validFname,
    validLname,
    commentMsgReq,
  } = validationMsg;

  //Methods
  useEffect(() => {
    if (isSubmit) {
      const values = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.companyName,
        email: formData.email,
        message: formData.commentMsg,
      };
      dispatch(sendUserContactInfo({ values })).then(({ payload }) => {
        if (payload.status) {
          handleClose();
          toast.success("Details submited successfully");
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const validateForm = (values) => {
    const errors = {};
    if (values.commentMsg === "") {
      errors.commentMsg = commentMsgReq;
      messageRef.current.focus();
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
    setFormData((prev) => {
      return {
        ...prev,
        [name]: name === "termsAndConditions" ? checked : value,
      };
    });
  };

  return (
    <div className="auth__inner">
      <div className="auth__header">
        <SiteLogo />
        <div className="auth__header__info">
          <h1>Contact Sales</h1>
          <p>Enter your details.</p>
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
              ErrorLabel={formErrors.firstName ? "Fist_Name_Error" : null}
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
              ErrorLabel={formErrors.lastName ? "Last_Name_Error" : null}
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
              ErrorLabel={formErrors.companyName ? "Password_Error" : null}
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
          <Col sm="12">
            <TextArea
              type="text"
              autoComplete="off"
              label={`Message:${commentMsg.length}/500`}
              placeholder="Enter message here"
              required={false}
              ref={messageRef}
              forLabel={"commentMsg"}
              name="commentMsg"
              value={commentMsg}
              maxLength="500"
              onChange={(e) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    commentMsg: e.target.value,
                  };
                });
              }}
              ErrorLabel={formErrors.commentMsg ? "Remarks_Error" : null}
              error={formErrors.commentMsg ? true : false}
              errorMsg={formErrors.commentMsg}
            />
          </Col>
          <Col sm="12">
            <div className="contactus-btn mt-3 d-flex align-items-center justify-content-center">
              <Button
                title={"Cancel"}
                className={"button--border me-3"}
                onClick={handleClose}
              />
              <Button
                title={"Submit"}
                className={"button--blue"}
                onClick={onSubmitHandler}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactUsForm;
