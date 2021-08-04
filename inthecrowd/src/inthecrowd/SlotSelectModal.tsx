import React, { ReactElement } from "react";
import { Button, Modal } from "react-bootstrap";

export default function SlotSelectModal(props: {
  modalContents: ReactElement;
  shareLocation: () => void;
  show: boolean;
  onHide: () => void;
}) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Body>{props.modalContents}</Modal.Body>
        <Modal.Footer>
          <Button onClick={props.shareLocation}>Share Location</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
