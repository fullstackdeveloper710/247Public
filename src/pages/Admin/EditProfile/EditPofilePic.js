import Button from "components/Button";
import ImageCropper from "components/ImageCropper";
import FileUpload from "components/fileUploadInput";
import Input from "components/inputField";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { bytesToSize } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const EditPofilePic = ({ handleClose, onImageSaveHandler }) => {
  const maxSizeOfImage = 2097152;
  const maxLimitDescription = 50;
  const [formErrors, setFormErrors] = useState({});
  const [showCropper, setShowCropper] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    file: "",
    description: "",
    croppedImage: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const descriptionRef = useRef();
  const fileRef = useRef();

  const { description, croppedImage, file, image } = formData;
  const { image_error } = formErrors;

  useEffect(() => {
    if (isSubmit) {
      onImageSaveHandler({ croppedImage, description });
      handleClose();
    }
    setIsSubmit(false);
  }, [isSubmit]);
  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const reader = new FileReader();
      const file = files[0];
      reader.onload = ({ target: { result } }) => {
        if (file.size <= maxSizeOfImage) {
          setShowCropper(true);
          setFormData((prev) => {
            return {
              ...prev,
              file: file,
              image: result,
            };
          });
        } else {
          setFormErrors((prev) => {
            return {
              ...prev,
              image_error: `Image should be less then ${bytesToSize(
                maxSizeOfImage
              )}`,
            };
          });
          fileRef.current.focus();
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (values.description === "") {
      errors.description = validationMsg.descriptionReq;
      descriptionRef?.current?.focus();
    }
    if (values.description?.length > maxLimitDescription) {
      errors.description = validationMsg.validDescription(maxLimitDescription);
      descriptionRef?.current?.focus();
    }
    if (values.file === "") {
      errors.image_error = validationMsg.imageReq;
      fileRef?.current?.focus();
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };

  const updateCroppedImg = (croppedImage) => {
    setFormData((prev) => {
      return {
        ...prev,
        croppedImage: croppedImage,
      };
    });
    setShowCropper(false);
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setFormData((prev) => {
      return {
        ...prev,
        file: null,
      };
    });
  };

  return (
    <>
      {showCropper ? (
        <ImageCropper
          updateCroppedImg={updateCroppedImg}
          image={image}
          file={file}
          cancelCrop={cancelCrop}
        />
      ) : (
        <Row>
          <Col md="12">
            <div className="profileUpload">
              {/* <div className="profileUpload__input"> */}
              <FileUpload
                forLabel="profile_Upload"
                error={image_error}
                ref={fileRef}
                btnLabel="Choose file"
                fileName={file?.name}
                accept="image/png, image/gif, image/jpeg"
                autoComplete="photo"
                ErrorLabel={image_error ? "file_error" : "note"}
                type="file"
                name="profilePic"
                fileNoteMsg={` Max size ${bytesToSize(
                  maxSizeOfImage
                )}. Formats: JPG, GIF, PNG.`}
                onInputChange={onInputChange}
              />
              {/* <label
                htmlFor="profile_Upload"
                className={
                  image_error
                    ? 'profileUpload__input border-danger'
                    : 'profileUpload__input'
                }>
                <button
                  type="button"
                  className="me-2"
                  onClick={(e) => {
                    e.preventDefault();
                    fileRef.current.click();
                  }}>
                  Choose file
                </button>
                <b>{file?.name ? file.name : 'No file Chosen'}</b>
              </label>

              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                autoComplete="photo"
                name="profilePic"
                onChange={onInputChange}
                id="profile_Upload"
                aria-describedby="note"
                ref={fileRef}
              />

              <span className="fileNote" id="note">
                Max size {bytesToSize(maxSizeOfImage)}. Formats: JPG, GIF, PNG.
              </span>
              {image_error && (
                <span className="text-danger" id="file_error">
                  {image_error}
                </span>
              )} */}
            </div>
            {/* <Input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    autoComplete="photo"
                    name="profilePic"
                    onChange={onInputChange}
                    forLabel="profile_Upload"
                    required={false}
                    // value={croppedImage}
                    ErrorLabel={fileLimitErr ? "note" : null}
                    ref={fileRef}
                    error={fileLimitErr ? true : false}
                    errorMsg={fileLimitErr}
                  />  */}
            {/* </div> */}
            <p className="fileNote_2">
              <b>Note:</b> It's mandatory to provide profile image description
              if you are uploading profile picture.
            </p>
          </Col>

          <Col md="12">
            <Input
              type="text"
              autoComplete="off"
              label={`Profile Image Description: ${description.length}/${maxLimitDescription}`}
              required={false}
              ref={descriptionRef}
              ErrorLabel={formErrors.description ? "desc_limit" : null}
              forLabel={"Image_Description"}
              name="description"
              value={description}
              error={formErrors.description ? true : false}
              errorMsg={formErrors.description}
              // onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>

          <Col md={12}>
            <div className="modalButton d-flex align-items-center justify-content-end">
              <Button
                title={"Cancel"}
                className={"button--border"}
                onClick={handleClose}
              />
              <Button
                title={"Save"}
                className={"button--blue ms-3"}
                onClick={onSubmitHandler}
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default EditPofilePic;
