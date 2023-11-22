import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_DETAIL } from "constants/title";
import {
  DollarRounded,
  DateFile,
  Discount,
  InvoiceIcon,
  StatusIcon,
} from "assets/images";
import { getInvoiceDetails } from "redux/asyncApi/orderApi";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { useLocation, useParams } from "react-router-dom";
import {
  currencyFormatter,
  dateFormat,
  removeUnderScore,
  usersTypes,
} from "util/helpers";
import InvoiceDetailsTable from "./InvoiceDetailsTable";
import DlTileList from "components/DlTileList";
import "./invoiceDetails.scss";

const InvoiceDetails = () => {
  //Redux state
  const invoiceDetails = useSelector(
    (state) => state.order?.custom_invoice_details
  );
  const { loading } = useSelector((state) => state.order);
  const { token, user: userDetails } = useSelector(
    (state) => state.app.userAuth
  );

  const {
    invoice_create_date,
    invoice_discount_amount,
    invoice_final_amount,
    invoice_number,
    label_value,
    label_text,
    invoice_total_amount,
    id,
  } = invoiceDetails || {};

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const params = useParams();
  const location = useLocation();

  //User roles
  const { user } = usersTypes;
  const userWiseCondition = userDetails?.role !== user;

  //Tab title
  document.title = ORDER_DETAIL(invoice_number);

  //Methods
  useEffect(() => {
    dispatch(getInvoiceDetails({ invoice_id: params?.id, token: token }));
  }, [params?.id]);

  //This array handle tiles
  const cardData = [
    {
      Icon: InvoiceIcon,
      dt: "invoice",
      dd: invoice_number,
    },
    {
      Icon: DateFile,
      dt: "Date",
      dd: moment(invoice_create_date).format(dateFormat),
    },
    {
      Icon: StatusIcon,
      dt: "Status",
      dd: (
        <span className={`_badge ${ORDER_STATUS_CLASS[label_value]}`}>
          {label_text}
        </span>
      ),
    },
    {
      Icon: DollarRounded,
      dt: "Subtotal",
      dd: currencyFormatter(invoice_total_amount),
    },
    {
      Icon: Discount,
      dt: "Discount",
      dd: currencyFormatter(invoice_discount_amount),
    },
    {
      Icon: DollarRounded,
      dt: "Total Amount Paid",
      dd: currencyFormatter(invoice_final_amount),
    },
  ];

  //This array handle payment tiles
  const paymentcardData = [
    {
      Icon: DateFile,
      dt: "Date of Payment",
      dd: invoiceDetails?.payment_date
        ? moment(invoiceDetails?.payment_date).format(dateFormat)
        : "N/A",
    },
    {
      Icon: InvoiceIcon,
      dt: "Payment by",
      dd: invoiceDetails?.payment_date
        ? removeUnderScore(invoiceDetails?.payment_date)
        : "N/A",
    },
  ];

  return (
    <>
      <div>
        {!loading && (
          <div className={`topCards ${!userWiseCondition && "customRowCard"}`}>
            <DlTileList
              className="dl_tile_list"
              data={cardData}
              TileClass="tile_class"
            />
          </div>
        )}
        <div className="mainWrapper UM-Wrapper order-detail">
          <div className="mainTitleWrapper ">
            {!loading && (
              <Row className="align-items-center">
                <Col sm={12} md={12}>
                  <h2 className="mainTitle mb-0" id="table_info">
                    Invoice Information
                  </h2>
                </Col>
              </Row>
            )}
          </div>
          <InvoiceDetailsTable
            location={location}
            params={params}
            order_details={invoiceDetails?.orders}
            success={invoiceDetails?.status}
            loading={loading}
            file_exist={invoiceDetails?.file_exist}
          />
        </div>

        {!loading && invoiceDetails?.payment_date && (
          <div className="customBlock mt-5 payment_tiles">
            <h2 className="mainTitle mb-4">Payment</h2>
            <DlTileList
              className="dl_tile_list"
              data={paymentcardData}
              TileClass="tile_class"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InvoiceDetails;
