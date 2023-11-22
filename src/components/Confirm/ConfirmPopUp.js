import React from "react";
import Button from "components/Button";
import Modal from "react-bootstrap/Modal";
import FocusTrap from "focus-trap-react";
import { Clear } from "assets/images";

const ConfirmPopUp = ({
  show,
  handleClose,
  onConfirmHandler,
  heading,
  Icon,
  confirmMsg,
  content,
}) => {
  const onHide = () => {
    handleClose();
  };
  const onConfirmation = () => {
    onConfirmHandler();
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      backdrop={true}
      className="trash-Modal"
    >
      <FocusTrap active={show}>
        <div>
          <Modal.Header>
            <button
              onClick={onHide}
              className="closeModalBtn"
              aria-label="Close"
            >
              <Clear aria-hidden="true" focusable="false" />
            </button>
            <h2 className="d-flex align-items-center text-capitalize">
              {Icon && (
                <button className="trashicon me-3">
                  <Icon />
                </button>
              )}
              {heading}
            </h2>
          </Modal.Header>
          <Modal.Body>
            <p tabIndex="0">{confirmMsg}</p>
            {content && <div className="mb-2">{content}</div>}
            <div className="modalButtons w-100 d-flex justify-content-between">
              <Button
                title={"No"}
                className={"button--white"}
                onClick={onHide}
              />
              <Button
                title={"Yes"}
                className={"button--danger ms-3"}
                onClick={onConfirmation}
              />
            </div>
          </Modal.Body>
        </div>
      </FocusTrap>
    </Modal>
  );
};

export default ConfirmPopUp;
