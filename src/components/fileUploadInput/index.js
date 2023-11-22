import React from 'react';

const FileUpload = React.forwardRef((props, ref) => {
  const {
    forLabel,
    error,
    btnLabel,
    fileName,
    accept,
    autoComplete,
    ErrorLabel,
    type,
    name,
    fileNoteMsg,
    onInputChange,
  } = props;
  return (
    <>
      <label
        htmlFor={forLabel}
        className={
          error ? 'profileUpload__input border-danger' : 'profileUpload__input'
        }>
        <button
          type="button"
          className="me-2"
          onClick={(e) => {
            e.preventDefault();
            ref.current.click();
          }}>
          {btnLabel}
        </button>
        <b>{fileName ? fileName : 'No file Chosen'}</b>
      </label>

      <input
        // style={{ display: 'none' }}
        type={type}
        accept={accept}
        autoComplete={autoComplete}
        name={name}
        onChange={onInputChange}
        id={forLabel}
        aria-describedby={ErrorLabel}
        ref={ref}
      />

      <span className="fileNote" id={ErrorLabel}>
        {fileNoteMsg}
      </span>
      {error && (
        <span className="error-msg" id={ErrorLabel}>
          {error}
        </span>
      )}
    </>
  );
});

export default FileUpload;
