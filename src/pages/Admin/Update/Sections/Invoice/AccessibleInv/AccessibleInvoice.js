import { MainLogo } from "assets/images";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { getInvoice } from "redux/asyncApi/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  currencyFormatter,
  dateFormat,
  removeUnderScore,
  usersTypes,
} from "util/helpers";
import moment from "moment";
import { ACCESSIBLE_INVOICE_TITLE } from "constants/title";
import "./accessibleInvoice.scss";

const AccessibleInvoice = () => {
  // tab title
  document.title = ACCESSIBLE_INVOICE_TITLE;

  //redux state
  const {
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};
  const { invoiceDetails } = useSelector((state) => state.order) || {};
  const { files, order_details, address } = invoiceDetails || {};

  //redux action dispatcher
  const dispatch = useDispatch();

  //params from router
  const params = useParams();

  //users role
  const { postpaidRoot } = usersTypes;

  //methods

  useEffect(() => {
    if (params.id) {
      const values = {
        invoice_number: params?.id,
      };
      dispatch(getInvoice({ token, values }));
    }
  }, []);  

  return (
    <div className="mainWrapper UM-Wrapper order-management-page">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6}>
            <h2 className="mainTitle mb-0" id="table_info">
              Invoice #{order_details?.order_invoice_number}
            </h2>
          </Col>
        </Row>
      </div>
      <div className="main-content order-table">
        {invoiceDetails ? (
          <div className="pdf">
            <div className="pdf-container">
              <div className="top-bar">
                <div className="left-logo left">
                  <figure>
                    <img src={MainLogo} alt="247 Accessible Documents Logo" />
                  </figure>
                </div>
                <div className="right-doc-type right">
                  <p className="company">
                    <b>247 Accessible Documents Pte.Ltd.</b>
                  </p>
                  <p>100 Cecil Street,</p>
                  <p>#15-02, The Globe,</p>
                  <p>Singapore</p>
                  <p>069532</p>
                </div>
              </div>

              <div className="bill-section">
                <div className="left">
                  <dl className="dl-comp">
                    <dt>BILL TO:</dt>
                    <dd>{address?.org_name}</dd>
                    <dt>Address:</dt>
                    <dd>{`${address?.address1 + ","}${address?.address2 + ","}${
                      address?.city + ","
                    }${address?.state + ","}${address?.country + ","}`}</dd>
                    <dt>Postal:</dt>
                    <dd>{address?.postal_code}</dd>
                  </dl>
                </div>
                <div className="right">
                  <dl className="dl-comp">
                    <dt>INVOICE #:</dt>
                    <dd>{order_details?.order_invoice_number}</dd>
                    <dt>DATE:</dt>
                    <dd>{order_details?.order_generate_date}</dd>
                  </dl>
                </div>
              </div>
              <div className="tableWrap">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th aria-label="serial-number">No.</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Delivery</th>
                        <th>Pages</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files?.map(
                        (
                          {
                            original_file_name,
                            file_type,
                            file_deliver_date,
                            file_page_count,
                            file_estimate_cost,
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{original_file_name}</td>
                              <td className="text-uppercase">
                                {file_type ? removeUnderScore(file_type) : ""}
                              </td>
                              <td>
                                {file_deliver_date
                                  ? moment(file_deliver_date).format(dateFormat)
                                  : ""}
                              </td>
                              <td>{file_page_count}</td>
                              <td>{currencyFormatter(file_estimate_cost)}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="total-here">
                <div className="left"></div>
                <div className="right">
                  <dl className="dl-comp">
                    <dt>TOTAL :</dt>
                    <dd>{currencyFormatter(order_details?.total_amount)}</dd>
                    <dt>DISCOUNT :</dt>
                    <dd>{currencyFormatter(order_details?.saving_amount)}</dd>
                    <dt>{role === postpaidRoot ? "PAYABLE :" : "PAID :"}</dt>
                    <dd>
                      {currencyFormatter(order_details?.final_payble_amount)}
                    </dd>
                  </dl>
                </div>
              </div>
              <footer></footer>
            </div>
          </div>
        ) : (
          <div className="no-invoice">
            <h1 className="text-muted">No invoice</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibleInvoice;
