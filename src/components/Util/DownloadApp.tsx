import { Dialog, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { AppStore, GooglePlay } from "assets/icons";
import { Dark, Home, Job, Manage } from "assets/mockup";
import { getMobileOS, MobileOS } from "helpers";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginTop: 24,
    marginBottom: 24,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  image: {
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    opacity: 0,
    transition: "opacity 500ms ease-in-out",
  },
  mobileImage: {
    height: 500,
    transition: "opacity 500ms ease-in-out",
  },
}));

interface Slide {
  title: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  close: () => void;
  recruiterMode?: boolean;
}

const DownloadApp: React.FC<Props> = ({
  isOpen,
  close,
  recruiterMode = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const slides: Slide[] = recruiterMode
    ? [
        { title: "職缺管理，一目瞭然", image: Manage },
        { title: "保護眼睛，更加專注", image: Dark },
        { title: "手機完成，輕鬆自在", image: Home },
        { title: "簡單直覺，切中要點", image: Job },
        // { title: "不漏接任何訊息", image: Chat },
      ]
    : [
        { title: "手機完成，輕鬆自在", image: Home },
        { title: "簡單直覺，切中要點", image: Job },
        { title: "職缺管理，一目瞭然", image: Manage },
        // { title: "不漏接任何訊息", image: Chat },
        { title: "保護眼睛，更加專注", image: Dark },
      ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    let timer: number | undefined;
    if (isOpen) {
      timer = window.setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 2000);
    }

    return () => clearInterval(timer);
  }, [isOpen, slides.length]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      PaperProps={{ className: classes.root }}
      onClick={close}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "72%",
          padding: 32,
        }}
      >
        {!isMobile && (
          <div
            className={classes.container}
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ position: "relative" }}>
              {slides.map((item, index) => (
                <img
                  key={index}
                  alt="screenshot"
                  src={item.image}
                  className={classes.image}
                  style={
                    currentSlideIndex === index ? { opacity: 1 } : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div
          className={classes.container}
          style={
            isMobile
              ? {
                  marginTop: "auto",
                  marginBottom: "auto",
                  padding: 0,
                }
              : {
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }
          }
        >
          <div>
            {isMobile && (
              <div
                style={{ position: "relative", height: 500, marginBottom: 32 }}
              >
                <img
                  alt="screenshot"
                  src={slides[currentSlideIndex].image}
                  className={classes.mobileImage}
                  style={{ opacity: 1 }}
                />
              </div>
            )}
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>
              下載 App
            </div>
            <div className={classes.title}>
              {slides[currentSlideIndex].title}
            </div>
            {isMobile ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getMobileOS() !== MobileOS.Android && (
                  <a href="https://to.milk.jobs/app">
                    <img alt="app store" src={AppStore} width="200" />
                  </a>
                )}
                {getMobileOS() !== MobileOS.Ios && (
                  <a href="https://to.milk.jobs/app">
                    <img alt="google play" src={GooglePlay} width="230" />
                  </a>
                )}
              </div>
            ) : (
              <QRCode
                size={240}
                level="Q"
                value="https://to.milk.jobs/app"
                includeMargin
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export { DownloadApp };
