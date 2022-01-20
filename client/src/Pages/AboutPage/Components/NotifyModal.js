import React from "react";
import "./NotifyModal.scss";
import { Spinner } from "react-bootstrap";

function NotifyModal({ closeModal, showModal, message, closebox }) {
  return (
    <div className="modal__container">
      <div className="modal">
        {closebox ? (
          <div className="modal_message">
            <div className="message_set">{message}</div>
          </div>
        ) : (
          <div className="modal_message">
            <div className="message_set">{message}</div>
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {closebox ? (
          <button className="modal__button" onClick={closeModal}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default NotifyModal;
