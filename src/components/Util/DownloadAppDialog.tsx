import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { AppStore, GooglePlay } from "assets/icons";
import logo from "assets/milk.png";
import { getMobileOS, MobileOS } from "helpers";
import QRCode from "qrcode.react";
import React from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
}

const DownloadAppDialog: React.FC<Props> = props => {
  const { isOpen, close } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>下載牛奶找工作 APP</DialogTitle>
      <DialogContent>
        {isMobile ? (
          <>
            {getMobileOS() !== MobileOS.Android && (
              <a href="https://to.milk.jobs/app">
                <img alt="app store" src={AppStore} width="200" />
              </a>
            )}
            {getMobileOS() !== MobileOS.Ios && (
              <a href="https://to.milk.jobs/app">
                <img alt="google play" src={GooglePlay} width="200" />
              </a>
            )}
          </>
        ) : (
          <QRCode
            size={256}
            level="Q"
            value="https://to.milk.jobs/app"
            imageSettings={{ src: logo, height: 50, width: 50 }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { DownloadAppDialog };
