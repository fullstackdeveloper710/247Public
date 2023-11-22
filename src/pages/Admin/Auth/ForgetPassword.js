import { ArrowRight, SiteLogo } from "assets/images";
import Button from "components/Button";
import Input from "components/inputField";
import { FORGET_PASSWORD_TITLE } from "constants/title";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearErrors } from "redux/Slices/appSlice";
import { forgetPassword } from "redux/asyncApi/appApi";
import { ROUTES } from "routes/constant";
import { basicEmailValidation } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  //Tab title
  document.title = FORGET_PASSWORD_TITLE;

  //Redux state
  const { errors } = useSelector((state) => state.app);

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Ref
  const emailRef = useRef();

  //Form validation messages
  const { emailReq, validEmail } = validationMsg;

  //Methods
  useEffect(() => {
    emailRef.current.focus();
    if (errors) {
      setError({ ...error, ...errors });
      emailRef.current.focus();
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [errors]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        email: email,
      };
      dispatch(forgetPassword(values)).then(({ payload }) => {
        if (payload?.status) {
          setShowSuccess(true);
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
  };

  const validateForm = (email) => {
    const errors = {};
    if (email === "") {
      errors.email = emailReq;
      emailRef.current.focus();
    } else if (basicEmailValidation(email)) {
      errors.email = validEmail;
      emailRef.current.focus();
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setError(validateForm(email));
  };
  return (
    <div className="auth">
      <div className="auth__Wrapper auth__forgotPasswordWrapper">
        <div className="auth__dialog">
          <div className="auth__inner">
            <div className="auth__header">
              <SiteLogo />
              <div className="auth__header__info">
                <h1>Forgot Password</h1>
              </div>
            </div>

            <div className="auth__body">
              <Row>
                {showSuccess ? (
                  <p tabIndex="0" className="m-2 text-success text-center">
                    We have sent reset password link on your registered email
                  </p>
                ) : (
                  <>
                    <Col md="12">
                      <Input
                        type="email"
                        autoComplete="email"
                        label="Email:"
                        required={false}
                        ref={emailRef}
                        ErrorLabel={error.email ? "Email_Error" : null}
                        forLabel={"Email"}
                        name="email"
                        value={email}
                        error={error.email ? true : false}
                        errorMsg={error.email}
                        onInputChange={onInputChange}
                      />
                    </Col>
                    <Col md="12">
                      <div className="auth__buttons">
                        <Button
                          title={"Reset"}
                          className={"button--blue"}
                          icon={
                            <ArrowRight aria-hidden="true" focusable="false" />
                          }
                          onClick={onSubmitHandler}
                        />
                      </div>
                    </Col>
                  </>
                )}
                <Col md="12">
                  {/* <ol className="authLinks" aria-label="authlinks">
                    <li>
                      Back to <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                    </li>
                  </ol> */}
                  <div className="authLinks">
                    <span>
                      Back to <Link to={ROUTES.SIGN_IN}>Sign In</Link>
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
  );
};

export default ForgetPassword;
