import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTablesComp from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "routes/constant";
import moment from "moment";
import { updateSlaType } from "redux/asyncApi/uploadApi";
import { dateFormat, removeUnderScore } from "util/helpers";

const SlaTable = ({ data, success, sla_types }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const { selectedUser } = useSelector((state) => state.upload);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const cellRendrer = useCallback(
    (cell, row, column, index, tHeadId) => {
      if (column === "original_file_name") {
        return (
          <div id={row.id} className="file_name_head">
            {row?.original_file_name}
          </div>
        );
      }

      if (column === "file_type") {
        return (
          <div className="text-uppercase" id={row.id}>
            {removeUnderScore(row?.file_type ?? "")}
          </div>
        );
      }
      if (column === "file_page_count") {
        return (
          <div id={row.id}>
            <span className="role">{row?.file_page_count}</span>
          </div>
        );
      }

      if (column === "file_deliver_date") {
        return (
          <div id={row.id}>
            <span className="role">
              {moment(row?.file_deliver_date).format(dateFormat)}
            </span>
          </div>
        );
      }
      if (column === "sla_types") {
        const onSelectChangeHandler = (e) => {
          const { value } = e.target;
          const values = {
            id: row.id,
            sla_type: value,
            // order_temp_id: row.order_temp_id,
            user_id: selectedUser?.value,
          };
          dispatch(
            updateSlaType({
              token,
              values,
            })
          );
        };
        return (
          <div id={row.id}>
            <span className="role">
              <select
                id="req_file"
                aria-labelledby={`${tHeadId} sla_types req_file`}
                className="form-select"
                value={row.sla_type}
                onChange={onSelectChangeHandler}
              >
                {row?.sla_types.map((type, index) => (
                  <option
                    key={type.id}
                    value={type?.feature_name?.toLowerCase()}
                  >
                    {`${type.feature_name} - USD ${type.feature_custom_price}`}
                  </option>
                ))}
              </select>
            </span>
          </div>
        );
      }

      return row[column];
    },
    [data]
  );

  const tableHead = [
    {
      key: "original_file_name",
      title: "FILE NAME",
      sorting: true,
      searching: true,
      width: "40%",
      theadId: "original_file_name",
    },
    {
      key: "file_type",
      title: "FILE TYPE",
      sorting: true,
      searching: true,
      // width: "40%",
      theadId: "file_type",
    },
    {
      key: "file_page_count",
      title: "PAGES",
      sorting: true,
      searching: false,
      // width: "20%",
      theadId: "file_page_count",
    },

    {
      key: "file_deliver_date",
      title: "Est. Date of Delivery",
      sorting: true,
      searching: false,
      // width: "20%",
      theadId: "file_deliver_date",
    },
    {
      key: "sla_types",
      title: "Delivery options",
      sorting: true,
      searching: false,
      // width: "20%",
      theadId: "sla_types",
    },
  ];

  return (
    <>
      <div className="dt-responsive border-table">
        {/* {!loading && success && data?.length > 0 && ( */}
          <DataTablesComp
            tableHead={tableHead}
            data={data}
            renderCell={cellRendrer}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            type="order"
            search={false}
            pageSizing={true}
            paginationBar={true}
            // pageSize={true}
            tableDescription="S.L.A List"
          />
        {/*  )}
         {(!loading && !success) ||
          (data?.length <= 0 && (
            <div className="no-record-main">
            <div className="no-record">No Record Found</div>
             </div>
          ))} */}
      </div>
    </>
  );
};
export default SlaTable;
