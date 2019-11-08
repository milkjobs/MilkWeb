import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import appStoreBadge from "assets/app-store-badge.svg";
import googlePlayBadge from "assets/google-play-badge.png";
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
              // TODO: app store link
              <a href="https://play.google.com/store/apps/details?id=com.milkjobs.app">
                <img alt="app store" src={appStoreBadge} width="200" />
              </a>
            )}
            {getMobileOS() !== MobileOS.Ios && (
              <a href="https://play.google.com/store/apps/details?id=com.milkjobs.app">
                <img alt="google play" src={googlePlayBadge} width="200" />
              </a>
            )}
          </>
        ) : (
          <QRCode
            size={256}
            level="Q"
            value="https://play.google.com/store/apps/details?id=com.milkjobs.app"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { DownloadAppDialog };
