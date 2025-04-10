import { createContext, useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    redirectPath: "",
    buttonText: "",
    cancelButtonText: "",
    confirmVariant: "success",     // 초록색 기본
    cancelVariant: "outline-success", // 연한 초록
    onConfirm: null,
    onCancel: null,
    show: false,
  });

  const navigate = useNavigate();

  const showPopup = ({
    title,
    message,
    redirectPath = "",
    buttonText = "확인",
    cancelButtonText = "",
    confirmVariant = "success",
    cancelVariant = "outline-success",
    onConfirm,
    onCancel,
  }) => {
    setPopupData({
      title,
      message,
      redirectPath,
      buttonText,
      cancelButtonText,
      confirmVariant,
      cancelVariant,
      onConfirm,
      onCancel,
      show: true,
    });
  };

  const handleClose = () => {
    setPopupData((prev) => ({ ...prev, show: false }));
  };

  const handleConfirm = () => {
    handleClose();
    if (popupData.onConfirm) popupData.onConfirm();
    if (popupData.redirectPath) navigate(popupData.redirectPath);
  };

  const handleCancel = () => {
    handleClose();
    if (popupData.onCancel) popupData.onCancel();
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}

      <Modal
        show={popupData.show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
        contentClassName="rounded-4 border border-success-subtle shadow-sm"
      >
        <Modal.Header closeButton className="bg-success-subtle border-0 rounded-top-4">
          <Modal.Title className="fw-bold text-success fs-5">
            🌱 {popupData.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center px-4 py-3 bg-light">
          <p className="fs-6 text-dark mb-0">{popupData.message}</p>
        </Modal.Body>

        <Modal.Footer className="justify-content-center pb-3 bg-light border-0 rounded-bottom-4">
          <Button
            variant={popupData.confirmVariant}
            size="md"
            className="px-4 me-2 rounded-pill"
            onClick={handleConfirm}
          >
            {popupData.buttonText || "확인"}
          </Button>

          {popupData.cancelButtonText && (
            <Button
              variant={popupData.cancelVariant}
              size="md"
              className="px-4 rounded-pill"
              onClick={handleCancel}
            >
              {popupData.cancelButtonText}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </PopupContext.Provider>
  );
}
