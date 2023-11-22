import { ArrowRight, SiteLogo } from "assets/images";
import Button from "components/Button";
import Input from "components/inputField";
import { RESET_PASSWORD_TITLE } from "constants/title";
import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { resetPassword } from "redux/asyncApi/appApi";
import { ROUTES } from "routes/constant";
import { Link, useNavigate } from "react-router-dom";
import { validationMsg } from "util/validationErrors";

const ResetPassword = () => {
  document.title = RESET_PASSWORD_TITLE;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const dispatch = useDispatch();

  const params = useParams();
  const { id } = params;

  const newPassRef = useRef();
  const confirmPassRef = useRef();
  const { newPassReq, confirmNewPassReq, validNewCofirmPass } = validationMsg;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validateForm = (values) => {
    const errors = {};
    if (values.confirmPassword === "") {
      errors.confirmPassword = confirmNewPassReq;
      confirmPassRef.current.focus();
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = validNewCofirmPass;
      confirmPassRef.current.focus();
    }
    if (values.newPassword === "") {
      errors.newPassword = newPassReq;
      newPassRef.current.focus();
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
    if (Object.keys(formErrors).length === 0) {
      const values = {
        password: newPassword,
        password_confirmation: confirmPassword,
        user_id: id,
      };
      dispatch(resetPassword(values)).then(({ payload }) => {
        if (payload.status) {
          setResetSuccess(true);
        }
      });
    }
  };
  const { newPassword, confirmPassword } = formData;
  return (
    <div className="auth">
      <div className="auth__Wrapper">
        <div className="auth__dialog">
          <div className="auth__inner">
            <div className="auth__header">
              <SiteLogo />
              <div className="auth__header__info">
                <h1>Reset Password</h1>
              </div>
            </div>

            <div className="auth__body">
              <Row>
                {!resetSuccess ? (
                  <>
                    <Col md="12">
                      <Input
                        type="password"
                        autoComplete="off"
                        label="New Password:"
                        confirmPass
                        required={false}
                        ref={newPassRef}
                        ErrorLabel={
                          formErrors.newPassword ? "New_Password_Error" : null
                        }
                        forLabel={"New_Password"}
                        name="newPassword"
                        value={newPassword}
                        error={formErrors.newPassword ? true : false}
                        errorMsg={formErrors.newPassword}
                        onInputChange={onInputChange}
                      />
                    </Col>
                    <Col md="12">
                      <Input
                        type="password"
                        autoComplete="off"
                        label="Confirm Password:"
                        required={false}
                        ref={confirmPassRef}
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
                    <Col md="12">
                      <div className="auth__buttons">
                        <Button
                          title={"Submit"}
                          className={"button--blue"}
                          icon={
                            <ArrowRight aria-hidden="true" focusable="false" />
                          }
                          onClick={onSubmitHandler}
                        />
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <p tabIndex="0" className="m-2 text-success text-center">
                      Password Reset Successfully
                    </p>
                    <Col md="12">
                      {/* <ol className="authLinks" aria-label="authlinks">
                        <li>
                          Back to <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                        </li>
                      </ol> */}
                      <div className="authLinks">
                        <span>
                          Back to
                          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                        </span>
                      </div>
                    </Col>
                  </>
                )}
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

export default ResetPassword;
