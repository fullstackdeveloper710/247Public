import React from "react";
import { Modal } from "react-bootstrap";
import FocusTrap from "focus-trap-react";
import { Clear } from "assets/images";

const CustomModal = ({
  children,
  show,
  handleClose,
  modalHeading,
  className,
  hideHeader,
}) => {
  const onHide = () => {
    handleClose();
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      backdrop={true}
      className={className}
    >
      <FocusTrap active={show}>
        <div>
          {!hideHeader && (
            <Modal.Header>
              <button
                onClick={onHide}
                className="closeModalBtn"
                aria-label="Close"
              >
                <Clear aria-hidden="true" focusable="false" />
              </button>
              <h2
                className="d-flex align-items-center"
                id="contained-modal-title-vcenter"
              >
                {modalHeading}
              </h2>
            </Modal.Header>
          )}
          <Modal.Body>{children}</Modal.Body>
        </div>
      </FocusTrap>
    </Modal>
  );
};

export default CustomModal;
