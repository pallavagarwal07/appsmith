import React from "react";
import { connect } from "react-redux";
import { AppState } from "reducers";
import { Keys } from "@blueprintjs/core";
import {
  showActionConfirmationModal,
  cancelActionConfirmationModal,
  acceptActionConfirmationModal,
} from "actions/pluginActionActions";
import DialogComponent from "components/ads/DialogComponent";
import styled from "styled-components";
import Button, { Category, Size } from "components/ads/Button";
import {
  createMessage,
  QUERY_CONFIRMATION_MODAL_MESSAGE,
} from "@appsmith/constants/messages";
import { ModalInfo } from "reducers/uiReducers/modalActionReducer";

type Props = {
  modals: ModalInfo[];
  dispatch: any;
};

const ModalBody = styled.div`
  padding-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 12px;
  }
`;

class RequestConfirmationModal extends React.Component<Props> {
  addEventListener = () => {
    document.addEventListener("keydown", this.onKeyUp);
  };

  removeEventListener = () => {
    document.removeEventListener("keydown", this.onKeyUp);
  };

  onKeyUp = (event: KeyboardEvent) => {
    // Sometimes calling the shortcut keys "Cmd + Enter" also triggers the onConfirm function below
    // so We check if no multiple keys are being pressed currently before executing this block of code.
    if (!(event.metaKey || event.ctrlKey) && event.keyCode === Keys.ENTER) {
      // please note: due to the way the state is being updated, the last action will always correspond to the right Action Modal.
      // this is not a bug.
      this.onConfirm(this.props.modals[this.props.modals.length - 1]);
    }
  };

  onConfirm = (modalInfo: ModalInfo) => {
    const { dispatch } = this.props;
    dispatch(acceptActionConfirmationModal(modalInfo.name));
    this.handleClose(modalInfo);
  };

  handleClose = (modalInfo: ModalInfo) => {
    const { dispatch } = this.props;
    dispatch(showActionConfirmationModal({ ...modalInfo, modalOpen: false }));
    dispatch(cancelActionConfirmationModal(modalInfo.name));
  };

  componentDidUpdate() {
    const { modals } = this.props;
    if (!!modals) {
      this.addEventListener();
    } else {
      this.removeEventListener();
    }
  }

  render() {
    const { dispatch, modals } = this.props;

    return (
      <>
        {modals.map((modalInfo: ModalInfo, index: number) => (
          <DialogComponent
            canEscapeKeyClose
            isOpen={modalInfo?.modalOpen}
            key={index}
            maxHeight={"80vh"}
            onClose={() => this.handleClose(modalInfo)}
            title="Confirm Action"
            width={"580px"}
          >
            <ModalBody>
              {createMessage(QUERY_CONFIRMATION_MODAL_MESSAGE)}
            </ModalBody>
            <ModalFooter>
              <Button
                category={Category.tertiary}
                cypressSelector="t--cancel-modal-btn"
                onClick={() => {
                  dispatch(cancelActionConfirmationModal(modalInfo.name));
                  this.handleClose(modalInfo);
                }}
                size={Size.medium}
                tag="button"
                text="Cancel"
                type="button"
              />
              <Button
                category={Category.primary}
                cypressSelector="t--confirm-modal-btn"
                onClick={() => this.onConfirm(modalInfo)}
                size={Size.medium}
                tag="button"
                text="Confirm"
                type="button"
              />
            </ModalFooter>
          </DialogComponent>
        ))}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  modals: state.ui.modalAction.modals,
});

export default connect(mapStateToProps)(RequestConfirmationModal);
