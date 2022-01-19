import React from "react";
import "./NotifyModal.scss";

function NotifyModal({ closeModal, showModal, message }) {
  return (
    <div className="modal__container">
      <div className="modal">
        <div>{message}</div>
        <button className="modal__button" onClick={closeModal}>
          Modal close
        </button>
      </div>
    </div>
  );
}

export default NotifyModal;
