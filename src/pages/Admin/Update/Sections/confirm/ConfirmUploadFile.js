import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmFileTable from "./ConfirmFileTable";
import Button from "components/Button";
// import { confirmedFiles } from "redux/Slices/uploadSlice";
// import { toast } from "react-toastify";
import { confirmUploadedFiles } from "redux/asyncApi/uploadApi";

const ConfirmUploadFile = ({ handleNext, handleBack }) => {
  const { token } = useSelector((state) => state.app.userAuth);
  const { uploadedFiles, confirmedFilesList } =
    useSelector((state) => state.upload) || {};
  const { data, status } = uploadedFiles || {};
  const dispatch = useDispatch();
  const neextBtnHandler = () => {
    const values = {
      ...data,
    };
    dispatch(confirmUploadedFiles({ token, values }));
    handleNext();
  };

  useEffect(() => {
    if (data.length <= 0) {
      handleBack();
    }
  }, [data]);

  return (
    <div className="customCard confirm_File_Block">
      <h2 className="mainTitle" id="table_info">
        Confirm File
      </h2>
      <div className="d-block">
        <ConfirmFileTable data={data} success={status} token={token} />
      </div>
      <div className="acc_note mt-5">
        <h3 className="mb-1">Note:</h3>
        <p>
          If you want an accessible Fillable Form, please select PDF Form or
          Doc/DocX Form from the required File Type.
        </p>
      </div>
      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          title={"Back"}
          className={"button--border"}
          onClick={() => {
            handleBack();
          }}
        />
        <Button
          title={"Next"}
          className={"button--blue ms-3"}
          autoFocus={true}
          onClick={neextBtnHandler}
        />
      </div>
    </div>
  );
};

export default ConfirmUploadFile;
