import { Dialog, DialogContent } from "@material-ui/core";
import React from "react";

interface Props {
  isOpen: boolean;
  message: string;
  close: () => void;
}

const AlertDialog: React.FC<Props> = props => {
  const { isOpen, close, message } = props;

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogContent>{message}</DialogContent>
    </Dialog>
  );
};

export { AlertDialog };
