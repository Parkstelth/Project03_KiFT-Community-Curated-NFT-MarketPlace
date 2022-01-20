import React from "react";
import "./NotifyModal.scss";

function NotifyModal({ closeModal, showModal, message, closebox }) {
  return (
    <div className="modal__container">
      <div className="modal">
        <div className="modal_message">{message}</div>

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
