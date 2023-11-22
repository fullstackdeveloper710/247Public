import { SIGN_IN_TITLE } from "constants/title";
import React, { useEffect, useRef, useState } from "react";
import "./Auth.scss";
import { ArrowRight, SiteLogo } from "assets/images";
import { Col, Row } from "react-bootstrap";
import Input from "components/inputField";
import Checkbox from "components/Checkbox/Checkbox";
import Button from "components/Button";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "redux/asyncApi/appApi";
import { ROUTES } from "routes/constant";
import { basicEmailValidation } from "util/helpers";
import { clearErrors } from "redux/Slices/appSlice";
import { toast } from "react-toastify";
import { validationMsg } from "util/validationErrors";

const SignIn = () => {
  document.title = SIGN_IN_TITLE;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    signed_in: false,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { errors } = useSelector((state) => state.app);
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const { emailReq, passReq } = validationMsg;

  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  useEffect(() => {
    if (user) {
      toast.success("Your email is now verified");
    }
  }, [user]);

  useEffect(() => {
    if (errors) {
      setFormErrors({ ...formErrors, ...errors });
      emailRef.current.focus();
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [errors]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        email: formData.email,
        password: formData.password,
        keep_me_login: signed_in,
      };
      dispatch(signIn(values));
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const onInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "signed_in") {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: checked,
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (values.password === "") {
      errors.password = passReq;
      passwordRef.current.focus();
    }
    if (values.email === "") {
      errors.email = emailReq;
      emailRef.current.focus();
    }
    // else if (!basicEmailValidation(values.email)) {
    //   errors.email = "Please enter valid Email.";
    //   emailRef.current.focus();
    // }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };
  const { email, password, signed_in } = formData;
  return (
    <div className="auth">
      <div className="auth__Wrapper">
        <div className="auth__dialog">
          <div className="auth__inner">
            <div className="auth__header">
              <SiteLogo />
              <div className="auth__header__info">
                <h1>Sign in</h1>
                <p>Let's get started.</p>
              </div>
            </div>

            <div className="auth__body">
              <Row>
                <Col md="12">
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
                </Col>

                <Col md="12">
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

                <Col md="12">
                  <div className="auth__checkbx">
                    <Checkbox
                      type="checkbox"
                      id="contrast_Checkbox"
                      name="signed_in"
                      checked={signed_in}
                      onChange={onInputChange}
                      label="Keep me signed in."
                      // ref={confirmationRef}
                      // ErrorLabel={
                      //   formErrors?.acc_confirmation
                      //     ? "complaince confirmation level error"
                      //     : "complaince confirmation level"
                      // }
                      // error={formErrors?.acc_confirmation}
                    />
                  </div>
                </Col>

                <Col md="12">
                  <div className="auth__buttons">
                    <Button
                      title={"Sign In"}
                      className={"button--blue"}
                      icon={<ArrowRight aria-hidden="true" focusable="false" />}
                      onClick={onSubmitHandler}
                    />
                  </div>
                </Col>

                <Col md="12">
                  {/* <ol className="authLinks" aria-label="authlinks">
                    <li>
                      <Link to={ROUTES.FORGET_PASSWORD}>Forgot Password?</Link>
                    </li>

                    <li>
                      Not a user? <Link to={ROUTES.REGISTER}>Sign up</Link>
                    </li>
                  </ol> */}

                  <div className="authLinks">
                    <span>
                      <Link to={ROUTES.FORGET_PASSWORD}>Forgot Password?</Link>
                    </span>
                    <span>
                      Not a user? <Link to={ROUTES.REGISTER}>Sign up</Link>
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

export default SignIn;
