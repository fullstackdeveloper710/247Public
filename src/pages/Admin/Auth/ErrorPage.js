import { SiteLogo } from "assets/images";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ErrorPage = () => {
  //router function
  const params = useParams();
  const { error } = params;

  //Errors for Link
  const Errors = {
    401: "Expired",
    403: "Invaild",
    404: "not available",
    // 200: "Already verified",
  };
  return (
    <div className="auth">
      <div className="auth__Wrapper auth__forgotPasswordWrapper">
        <div className="auth__dialog">
          <div className="auth__inner">
            <div className="auth__header">
              <SiteLogo />
              <div className="auth__header__info">
                <h1>{`Account Activation Link Is ${Errors[error]}!`}</h1>
              </div>
            </div>

            <div className="auth__body">
              <Row>
                <Col md="12">
                  <div>
                    <p>
                      Your verification link is {Errors[error]}. To resolve this
                      issue, please contact our{" "}
                      <a
                        target="_blank"
                        href="mailto:support@247accessibledocuments.com"
                      >
                        support
                      </a>{" "}
                      team.
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
