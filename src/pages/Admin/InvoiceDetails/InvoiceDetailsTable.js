import React, { useCallback, useState } from "react";
import moment from "moment";
import DataTablesComp from "components/dataTable";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { currencyFormatter, dateFormat, noRecordFound } from "util/helpers";

const InvoiceDetailsTable = ({ order_details, success, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

    //This function handle datatable row and columns.
  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "id") {
        return (
          <>
            <a href="#" className="download-link">
              {"PORD-" + row?.id}
            </a>
          </>
        );
      }
      if (column === "order_generate_date") {
        return (
          <div>
            <span className="role">
              {moment(row.order_generate_date).format(dateFormat)}
            </span>
          </div>
        );
      }
      if (column === "order_total_pages") {
        return <div>{row.order_total_pages}</div>;
      }
      if (column === "label_text") {
        return (
          <div>
            <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
              {row?.label_text}
            </span>
          </div>
        );
      }
      if (column === "order_payable_amount") {
        return (
          <div>
            <span>{currencyFormatter(row?.order_payable_amount)}</span>
          </div>
        );
      }

      return row[column];
    },
    [order_details]
  );

  //This array is work for show table headers dynamicly in data table.
  const tableHead = [
    { title: "Order No.", key: "id", sorting: true },
    { title: "Date", key: "order_generate_date", sorting: true },
    { title: "Total Pages", key: "order_total_pages", sorting: true },
    { title: "Status", key: "label_text", sorting: true },
    { title: "total", key: "order_payable_amount", sorting: false },
  ];

  return (
    <div className="dt-responsive">
      {/* {success && (
        <div> */}
          {/* {!loading && success && ( */}
            <DataTablesComp
              tableHead={tableHead}
              data={order_details}
              renderCell={cellRendrer}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setPageSize={setPageSize}
              pageSize={pageSize}
              type="order-details"
              search={false}
              pageSizing={true}
              paginationBar={true}
              tableDescription="Order Details List"
            />
          {/* )} */}
        {/* </div>
      )} */}
      {/* {!loading && !success && order_details?.message && (
        <div className="no-record-main">
          <div className="no-record">{noRecordFound}</div>
        </div>
      )} */}
    </div>
  );
};
export default InvoiceDetailsTable;
