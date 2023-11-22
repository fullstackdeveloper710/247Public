import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/Button";
import SlaTable from "./SlaFileTable";
import { updateAllSlaTypes } from "redux/asyncApi/uploadApi";

const SlaFile = ({ handleNext, handleBack }) => {
  const { slaList, disabledSla } = useSelector((state) => state.upload) || {};
  const { data, status, sla_types } = slaList || {};
  const [slaType, setSlaType] = useState("1");
  const dispatch = useDispatch();
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const { uploadedFiles } = useSelector((state) => state.upload);
  const { order_temp_id } = uploadedFiles || {};
  const neextBtnHandler = () => {
    handleNext();
  };

  const onSlaChangehandler = (e) => {
    const { value } = e.target;
    setSlaType(value);
    const values = {
      order_temp_id,
      sla_type: value,
    };
    dispatch(updateAllSlaTypes({ token, values }));
  };

  return (
    <div className="customCard confirm_File_Block">
      <h2 className="mainTitle" id="table_info">
        Delivery Types
      </h2>
      <span className="visually_hidden">
        The Est. Date of Delivery will update based on the type of Delivery
        Option selected
      </span>
      <div className="d-block">
        <SlaTable data={data} success={status} sla_types={sla_types} />
      </div>
      <div className="d-flex justify-content-between align-items-center sla__buttons">
        <div className="sla_select_box">
          {/* {data?.length > 1 && (
            <>
              <label htmlFor="slaForAllFiles">Apply S.L.A for All Files</label>
              <select
                disabled={disabledSla}
                id="slaForAllFiles"
                className="form-select"
                value={slaType}
                onChange={onSlaChangehandler}
              >
                {sla_types.map((type, index) => (
                  <option key={type.id} value={type.label_text}>
                    {type.label_text}
                  </option>
                ))}
              </select>
            </>
          )} */}
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
    </div>
  );
};

export default SlaFile;
