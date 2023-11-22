import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTablesComp from "components/dataTable";
import { confirmedFiles } from "redux/Slices/uploadSlice";
import { removeFile } from "redux/asyncApi/uploadApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "routes/constant";
import moment from "moment";
import { Trash3 } from "assets/images";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";

const ConfirmFileTable = ({ data, success, token }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.app) || {};
  const { fileTypes, selectedUser } =
    useSelector((state) => state.upload) || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [id, setId] = useState({});

  // Modal Constants
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const cellRendrer = useCallback(
    (cell, row, column, index, tHeadId) => {
      if (column === "original_file_name") {
        return (
          <div id={row.id} className="file_name_head">
            {row?.original_file_name}
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
      // if (column === "file_deliver_date") {
      //   return (
      //     <div id={row.id}>
      //       <span className="role">
      //         {moment(row?.file_deliver_date).format("MMM DD, YYYY")}
      //       </span>
      //     </div>
      //   );
      // }
      if (column === "file_type") {
        const onSelectChangeHandler = (e) => {
          const { value } = e.target;
          const result = data.map((element) => {
            if (element.id === row.id) {
              return {
                ...element,
                file_type: value,
              };
            } else {
              return element;
            }
          });
          dispatch(confirmedFiles(result));
        };

        const reqFileId = "req_file"+row?.id;

        return (
          <div id={row.id}>
            <span className="role">
              <select
                id={reqFileId}
                className="form-select"
                aria-labelledby={`${tHeadId} ${reqFileId} file_type_sort`}
                value={row.file_type}
                onChange={onSelectChangeHandler}
              >
                {row.filetype.map((type, index) => (
                  <option key={type.id} value={type.label_text}>
                    {type.label_text}
                  </option>
                ))}
              </select>
            </span>
          </div>
        );
      }
      if (column === "action") {
        const remDelId="rem_del"+row?.id;
        return (
          <div>
            <button
              id={remDelId}
              className="trashicon"
              aria-labelledby={`${tHeadId} ${remDelId} action`}
              onClick={() =>
                setId({
                  id: row?.id,
                  order_temp_id: row?.order_temp_id,
                }) & handleShow()
              }
            >
              <Trash3 id={row.doc_name} role="img" aria-label="Delete" />
            </button>
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
      key: "file_page_count",
      title: "PAGES",
      sorting: true,
      searching: false,
      width: "20%",
      theadId: "page_cout",
    },
    // {
    //   key: "file_deliver_date",
    //   title: "Est. Date of Delivery",
    //   sorting: true,
    //   searching: false,
    //   width: "20%",
    // },
    {
      key: "file_type",
      title: "REQUIRED FILE TYPE",
      sorting: true,
      searching: false,
      width: "12%",
      theadId: "file_type_sort",
    },
    {
      key: "action",
      title: "ACTIONS",
      sorting: false,
      searching: false,
      width: "8%",
      theadId: "action",
    },
  ];

  const onConfirmHandler = () => {
    handleClose();
    const values = {
      ...id,
      user_id: selectedUser?.value,
    };
    dispatch(removeFile({ token, values }));
  };

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
            tableDescription="Confirm File List"
          />
        {/* )} */}
        {/* {(!loading && !success) ||
          (data?.length <= 0 && (
            <div className="no-record-main">
              <div className="no-record">No Record Found</div>
            </div>
          ))} */}
      </div>
      <ConfirmPopUp
        Icon={Trash3}
        heading="Delete file"
        confirmMsg="You are about to delete a file.Are you sure that you want to
        delete this file?"
        show={show}
        handleClose={handleClose}
        onConfirmHandler={onConfirmHandler}
      />
    </>
  );
};
export default ConfirmFileTable;
