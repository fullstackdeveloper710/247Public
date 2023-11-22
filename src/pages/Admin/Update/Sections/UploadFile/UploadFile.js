import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useDrivePicker from "react-google-drive-picker";
import { ReactOneDriveFilePicker } from "react-onedrive-filepicker/lib";
import { uploadFiles } from "redux/asyncApi/uploadApi";
import {
  UploadFileNew,
  SharePoint,
  OneDrive,
  GoogleDrive,
} from "assets/images";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/Button";
import ProgressBar from "components/progressBar";
import { toast } from "react-toastify";
import { bytesToSize, usersTypes } from "util/helpers";
import CustomReactSelect from "components/CustomReactSelect";
import { updateUserId } from "redux/Slices/uploadSlice";
import { getCustomUsers } from "redux/asyncApi/userApi";
import { message } from "util/message";

const UploadFile = ({ handleBack, handleNext }) => {
  const [openPicker] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  //values from redux
  //upload Slice
  const { uploadedFiles, fileLoaded, selectedUser } =
    useSelector((state) => state.upload) || {};
  const { customUsers } = useSelector((state) => state.user);

  //app Slice
  const {
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};
  const { data, total_files, uploaded_file_size, order_temp_id, status } =
    uploadedFiles || {};

  //redux action dispatcher
  const dispatch = useDispatch();
  const { user, superAdmin } = usersTypes;

  //max limit of files
  const maxLimitBinary = 524288000;
  const singleFileLimit = 524288000;

  //This function uses to asyncronuslly upload file
  const asyncUploadFiles = async (files, selectedUser) => {
    let orderId = order_temp_id;
    let err;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > singleFileLimit) {
        toast.info(message.singleFileLimit(files[i].name, singleFileLimit));
        const filtred = files.filter((item) => item.size < singleFileLimit);
        setFiles(filtred);
        setUploading(false);
        continue;
      }
      if (err) {
        setUploading(false);
        break;
      } else {
        setUploading(true);
        const values = {
          file: files[i],
          order_temp_id: orderId,
        };
        if (selectedUser?.value) {
          values.user_id = selectedUser?.value;
        }
        await dispatch(uploadFiles({ token, values }))
          .then((res) => {
            if (res.payload.status) {
              setUploaded((prev) => prev + 1);
              orderId = res.payload.order_temp_id;
              if (i === files.length - 1) {
                setUploading(false);
              }
            }
          })
          .catch((error) => {
            err = error;
            setFiles([]);
            setUploading(false);
          });
      }
    }
  };
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!uploading) {
        setFiles([]);
        setUploaded(0);
        let totalSize = uploaded_file_size;
        acceptedFiles.forEach((file) => {
          totalSize += file.size;
        });
        if (totalSize <= maxLimitBinary) {
          acceptedFiles.forEach((file) => {
            setFiles((prev) => [...prev, file]);
          });
        }
        if (totalSize <= maxLimitBinary) {
          asyncUploadFiles(acceptedFiles, selectedUser);
        } else {
          toast.info(message.fileLimitExceed(maxLimitBinary));
        }
      } else {
        toast.info(message.waitPrevFiles);
      }
    },
    [data, uploading, selectedUser]
  );
  const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
    onDrop,
    accept: {
      file: [".pdf", ".ppt", ".pptx", ".doc", ".docx"],
    },
    noClick: true,
    // minSize: minLimitBinary,
  });
  const handleOpenPicker = () => {
    if (role === user) {
      toast.info(message.updateSubForFeature);
    } else {
      toast.info(message.commingSoonFeature);
    }
    //  else {
    //   openPicker({
    //     clientId:
    //       "763825601926-ummnbtkto45orfemk9pcljisisttp0i2.apps.googleusercontent.com",
    //     developerKey: "AIzaSyD8v_V1U7Wofly4p-VWR-ySny2u9bnYwvo",
    //     viewId: "DOCUMENTS",
    //     showUploadView: true,
    //     showUploadFolders: true,
    //     supportDrives: true,
    //     multiselect: true,
    //     callbackFunction: (data) => {
    //       if (data.action === "cancel") {
    //         console.log("User clicked cancel/close button");
    //       }
    //       setFiles(data.docs);
    //     },
    //   });
    // }
  };

  // get Custom users list for superAdmin user
  useEffect(() => {
    if (role === superAdmin && !customUsers.data) {
      dispatch(getCustomUsers(token));
    }
  }, [role]);

  //This function uses to remove unnessery elements from dropzone
  useEffect(() => {
    const element = document.getElementById("dropezoneElementId");
    if (element) {
      const role = element.getAttributeNode("role");
      const tabindex = element.getAttributeNode("tabindex");
      if (role && tabindex) {
        element.removeAttributeNode(role);
        element.removeAttributeNode(tabindex);
      }
    }
  }, [dispatch]);

  //This function uses to show popups if the file type not is supported
  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.map((item) => {
        if (item?.errors?.[0].code === "file-invalid-type") {
          toast.error(message.notSupportedFile(item.file.name));
        }
      });
    }
  }, [fileRejections]);

  const handleSharePointPicker = () => {
    if (role === user) {
      toast.info(message.updateSubForFeature);
    } else {
      toast.info(message.commingSoonFeature);
    }
  };
  const saveData = () => {
    if (total_files > 0) {
      handleNext();
    }
  };

  const selectUserHandler = (e) => {
    dispatch(updateUserId(e));
  };
  let filesCount = files.length;
  return (
    <div className="customCard upload_File_Block">
      {role === superAdmin && (
        <div className="postpaidSelect">
          <h2 className="mainTitle">Select Postpaid User</h2>
          <CustomReactSelect
            className=""
            disabled={files.length > 0 || total_files > 0}
            defaultValue={selectedUser}
            data={customUsers?.data}
            onSelectHandler={selectUserHandler}
            showOptionBadge={false}
            isClearable={true}
          />
        </div>
      )}
      <h2 className="mainTitle">Select File</h2>
      <div className="upload-area text-center mt-4">
        <section className="drop_zone">
          <div
            {...getRootProps({
              className: "dropzone",
              id: "dropezoneElementId",
            })}
          >
            <input {...getInputProps()} />
            <span className="uploadicon">
              <UploadFileNew aria-hidden="true" focusable="false" />
            </span>
            <p>
              <span>Upload a file</span> or drag and drop
            </p>
            <em
              id="file_type"
              className="mt-3"
            >{`(Supported file types: PDF,PPT,WORD)`}</em>
            <Button
              onClick={open}
              aria-label="Select File"
              title={"Select File"}
              className="button--blue mx-auto my-4 "
              aria-describedby="file_type"
            />
            <p>Or upload using</p>
            <ul className="upload-menus d-flex align-items-center justify-content-center">
              <li>
                <button
                  className="upload-buttons"
                  onClick={handleSharePointPicker}
                >
                  <SharePoint
                    role="img"
                    aria-label="SharePoint"
                    focusable="false"
                  />
                </button>
              </li>
              <li>
                {/* <ReactOneDriveFilePicker
                  clientID="683ca8b7-fce1-45ce-be71-c076ac15ec69"
                  action="query"
                  multiSelect={true}
                  onSuccess={(result) => {
                    alert(JSON.stringify(result));
                  }}
                  onCancel={(result) => {
                    alert(JSON.stringify(result));
                  }}
                > */}
                <button
                  className="upload-buttons"
                  onClick={() => {
                    if (role === user) {
                      toast.info(message.updateSubForFeature);
                    } else {
                      toast.info(message.commingSoonFeature);
                    }
                  }}
                >
                  <OneDrive
                    role="img"
                    aria-label="OneDrive"
                    focusable="false"
                  />
                </button>
                {/* </ReactOneDriveFilePicker> */}
              </li>
              <li>
                <button
                  className="upload-buttons"
                  onClick={() => handleOpenPicker()}
                >
                  <GoogleDrive
                    role="img"
                    aria-label="GoogleDrive"
                    focusable="false"
                  />
                </button>
              </li>
            </ul>
            {filesCount > 0 ? (
              <div className="multifile_progress mb-3">
                <ProgressBar
                  min={0}
                  max={100}
                  current={fileLoaded}
                  status={status}
                />
              </div>
            ) : null}
            {filesCount > 0 && (
              <div role="status">
                {uploading ? (
                  <em className="mx-1">Uploading...</em>
                ) : (
                  <em className="mx-1">
                    Uploaded files {uploaded}/{filesCount}
                  </em>
                )}
              </div>
            )}

            {total_files > 0 && (
              <em className="text-success">
                {total_files} files were received to upload
              </em>
            )}
            {uploaded_file_size > 0 && (
              <p>
                {`Memory remains ${bytesToSize(
                  maxLimitBinary - uploaded_file_size
                )}`}
              </p>
            )}
          </div>
        </section>
      </div>
      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          disabled
          title={"Back"}
          className="button--border"
          onClick={() => handleBack()}
        />
        <Button
          title={"Next"}
          className="button--blue ms-3"
          disabled={uploading || total_files <= 0 ? true : false}
          onClick={() => saveData()}
        />
      </div>
    </div>
  );
};
export default UploadFile;
