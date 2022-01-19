import React from "react";
import "./NotifyModal.scss";

function NotifyModal({ closeModal, showModal, message }) {
  return (
    <div className="modal__container">
      <div className="modal">
        <div className="modal_message">{message}</div>
        <button className="modal__button" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default NotifyModal;
