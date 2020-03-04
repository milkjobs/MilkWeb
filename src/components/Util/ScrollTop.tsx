import {
  createStyles,
  makeStyles,
  Theme,
  useScrollTrigger,
  useTheme,
  Zoom
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  })
);

interface Props {
  children: React.ReactElement;
}

const ScrollTop: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        className={classes.root}
        style={
          window.innerWidth > 1080
            ? {
                left: (window.innerWidth - 960) / 2 + 960 + theme.spacing(2),
                right: "auto"
              }
            : undefined
        }
      >
        {children}
      </div>
    </Zoom>
  );
};

export { ScrollTop };
