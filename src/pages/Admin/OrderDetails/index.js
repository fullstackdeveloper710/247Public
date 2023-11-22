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
  UserIcon,
  CheckIcon,
  Clear,
  SlaIcon,
} from "assets/images";
import { getOrderByID } from "redux/asyncApi/orderApi";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { useLocation, useParams } from "react-router-dom";
import OrderDetailsTable from "./OrderDetailsTable";
import {
  currencyFormatter,
  dateFormat,
  notAvailable,
  removeUnderScore,
  usersTypes,
} from "util/helpers";
import DlTileList from "components/DlTileList";
import "./orderDetails.scss";

const OrderDetails = () => {
  //redux state
  const getOrderDetails = useSelector((state) => state.order?.getOrderDetails);
  const { loading } = useSelector((state) => state.order);
  const { token, user: userDetails } = useSelector(
    (state) => state.app.userAuth
  );

  const {
    order_invoice_number,
    order_generate_date,
    job_order_no,
    label_value,
    label_text,
    final_payble_amount,
    total_amount,
    saving_amount,
    id,
  } = getOrderDetails?.order || {};

  //Redux action dispatcher.
  const dispatch = useDispatch();

  //Tab title
  document.title = ORDER_DETAIL(
    order_invoice_number === "NULL" ? job_order_no : order_invoice_number
  );

  //Params and location from router.
  const params = useParams();
  const location = useLocation();

  //User roles.
  const { user } = usersTypes;

  //methods

  useEffect(() => {
    dispatch(getOrderByID({ order_id: params?.id, token: token }));
  }, []);

  //User wise condition.
  const userWiseCondition = userDetails?.role !== user;

  // Array for tiles
  const cardData = [
    {
      Icon: InvoiceIcon,
      dt: "invoice",
      dd: order_invoice_number ?? notAvailable,
    },
    {
      Icon: DateFile,
      dt: "Date",
      dd: moment(order_generate_date).format(dateFormat),
    },
    {
      Icon: SlaIcon,
      dt: "Accessibility Requirement",
      dd: (
        <>
          <p className="order_card_paragraph acc_paragraph">
            {getOrderDetails?.order?.acc_complaince_level.replace(
              /level aa/gi,
              ""
            )}
          </p>
          <div className="order_card_body">
            <div className="d-flex">
              <p>
                <span>
                  {getOrderDetails?.order?.acc_confirmation === "Y" ? (
                    <CheckIcon
                      focusable="false"
                      role="img"
                      aria-label="Included"
                    />
                  ) : (
                    <Clear
                      className="text-danger"
                      focusable="false"
                      role="img"
                      aria-label="Not Included"
                    />
                  )}
                </span>
                Color Contrast
              </p>
              {userWiseCondition && (
                <>
                  <p>
                    <span>
                      {getOrderDetails?.order?.acc_extend_alt === "Y" ? (
                        <CheckIcon
                          focusable="false"
                          role="img"
                          aria-label="Included"
                        />
                      ) : (
                        <Clear
                          className="text-danger"
                          focusable="false"
                          role="img"
                          aria-label="Not Included"
                        />
                      )}
                    </span>
                    Extended Alt
                  </p>
                  <p>
                    <span>
                      {getOrderDetails?.order?.acc_tabel_summary === "Y" ? (
                        <CheckIcon
                          focusable="false"
                          role="img"
                          aria-label="Included"
                        />
                      ) : (
                        <Clear
                          className="text-danger"
                          focusable="false"
                          role="img"
                          aria-label="Not Included"
                        />
                      )}
                    </span>
                    Table Summary
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      ),
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
      dd: currencyFormatter(total_amount),
    },
    {
      Icon: Discount,
      dt: "Discount",
      dd: currencyFormatter(saving_amount),
    },
    {
      Icon: DollarRounded,
      dt: "Total Amount Paid",
      dd: currencyFormatter(final_payble_amount),
    },
  ];

  userWiseCondition &&
    cardData.unshift({
      Icon: UserIcon,
      dt: "Order By",
      dd: getOrderDetails?.order_details?.[0]?.users?.name,
    });

  //Array for payment tiles.
  const paymentcardData = [
    {
      Icon: DateFile,
      dt: "Date of Payment",
      dd: getOrderDetails?.payment_date?.[0]?.payment_date
        ? moment(getOrderDetails?.payment_date?.[0]?.payment_date).format(
            dateFormat
          )
        : "N/A",
    },
    {
      Icon: InvoiceIcon,
      dt: "Payment by",
      dd: getOrderDetails?.payment_date?.[0]?.mode
        ? removeUnderScore(getOrderDetails?.payment_date?.[0]?.mode)
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
                    Order Information
                  </h2>
                </Col>
              </Row>
            )}
          </div>
          <OrderDetailsTable
            location={location}
            params={params}
            order_details={getOrderDetails?.order_details}
            success={getOrderDetails?.status}
            loading={loading}
            file_exist={getOrderDetails?.file_exist}
            id={id}
          />
        </div>

        {!loading && getOrderDetails?.payment_date && (
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

export default OrderDetails;
