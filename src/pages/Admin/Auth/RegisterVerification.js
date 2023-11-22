import GTMTAGS from "components/GTMTAGS";
import { ArrowRight, SiteLogo } from "assets/images";
import Button from "components/Button";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "routes/constant";

const RegisterVerification = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { name } = params;
  return (
    <>
      <GTMTAGS />
      <div className="auth">
        <div className="auth__Wrapper auth__forgotPasswordWrapper">
          <div className="auth__dialog">
            <div className="auth__inner">
              <div className="auth__header">
                <SiteLogo />
                <div className="auth__header__info">
                  <h1>Welcome to 247 Accessible Documents</h1>
                </div>
              </div>

              <div className="auth__body">
                <Row>
                  <Col md="12">
                    <div>
                      <p>
                        Hi <span className="text-capitalize">{name}</span>,
                        thanks for registering yourself with 247 Accessible
                        Documents. Please check your registered email for
                        verification and get started on making your documents
                        accessible!
                      </p>
                      <p>
                        If you have any queries or suggestions, please contact
                        our <a href="#">sales</a> team.
                      </p>
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="auth__buttons">
                      <Button
                        title={"Sign-In"}
                        className={"button--blue"}
                        icon={
                          <ArrowRight aria-hidden="true" focusable="false" />
                        }
                        onClick={() => {
                          navigate(ROUTES.SIGN_IN);
                        }}
                      />
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
    </>
  );
};

export default RegisterVerification;
