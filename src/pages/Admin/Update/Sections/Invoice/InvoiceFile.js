import { OrderSuccess } from "assets/images";
import React, { useEffect, useState } from "react";
import Button from "components/Button";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./Invoice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { uploadInvoice } from "redux/asyncApi/uploadApi";
import { ROUTES } from "routes/constant";
import { useNavigate } from "react-router-dom";
import { getPostpaidOrdersCount } from "redux/asyncApi/orderApi";
import { usersTypes } from "util/helpers";

const InvoiceFile = () => {
  const [fileUrl, setFileUrl] = useState();

  //Redux state
  const {
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};
  const { paymentData } = useSelector((state) => state.payment) || {};
  const { files, order_details,address } = paymentData || {};
  const {
    final_payble_amount,
    order_delivery_date,
    order_generate_date,
    order_invoice_number,
    order_total_files,
    order_total_pages,
    payment_date,
    saving_amount,
    total_amount,
    id,
  } = order_details || {};

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const navigate = useNavigate();

  //Users types
  const { superAdmin } = usersTypes;

  //invoice table condition
  const perPageData = 10;

  //Methods
  useEffect(() => {
    if (role === superAdmin) {
      dispatch(getPostpaidOrdersCount(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const config = { responseType: "blob" };
    axios.get(fileUrl, config).then((response) => {
      if (response.status === 200) {
        const file = new File([response.data], order_invoice_number, {
          type: response.data.type,
        });
        const values = {
          invoice_file: file,
          order_id: id,
        };
        dispatch(uploadInvoice({ token, values }));
      }
    });
  }, [fileUrl]);

  return (
    <div className="customCard orderBlock">
      <div className="orderSuccessful">
        <figure className="success-icon">
          <OrderSuccess aria-hidden="true" focusable="false" />
        </figure>
        <h2>Order Successful</h2>
        <span>Invoice No.: {order_invoice_number}</span>
        <p>We will send you an email when the file is ready for delivery.</p>
      </div>
      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          title="View Invoice"
          role="button"
          className="btn btn--md button--border"
          onClick={() =>
            navigate(
              ROUTES.ACCESSIBLE_INVOICE.replace(/:id/g, order_invoice_number)
            )
          }
        />

        <BlobProvider
          document={
            <Invoice
              data={_.chunk(files, perPageData)}
              total_amount={total_amount}
              saving_amount={saving_amount}
              final_payble_amount={final_payble_amount}
              perPageData={perPageData}
              order_invoice_number={order_invoice_number}
              order_generate_date={order_generate_date}
              address={address}
            />
          }
        >
          {({ blob, url, loading, error }) => {
            if (error) {
              console.log(error, "error");
            }
            if (!loading) {
              setFileUrl(url);
              return (
                <>
                  <a
                    role="button"
                    className="btn btn--md button--blue ms-3"
                    href={url}
                    download={order_invoice_number}
                  >
                    Download Invoice
                  </a>
                </>
              );
            }
          }}
        </BlobProvider>
      </div>
    </div>
  );
};

export default InvoiceFile;
