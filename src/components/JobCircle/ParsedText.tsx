import { makeStyles, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import Linkify from "react-linkify";
import { themeSubTitles } from "config";
import ReactHashTag from "react-hashtag";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: "left",
    fontSize: 16,
    color: "black",
  },
  more: {
    cursor: "pointer",
    color: theme.palette.secondary.main,
  },
  hashTag: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
  },
}));

interface ParseTextProps {
  text: string;
  showLine: number;
}

const ParsedText: React.FC<ParseTextProps> = ({ text, showLine }) => {
  const classes = useStyles();
  const theme = useTheme();
  const lines = text.split("\n");
  const lineNumber = showLine - 1;
  const [hideText, setHideText] = useState(lines.length > lineNumber);

  return (
    <>
      {hideText
        ? lines.slice(0, lineNumber).map((t, index) => (
            <div key={t + index} className={classes.text}>
              {t === "" ? (
                <br />
              ) : t.includes("#") ? (
                <ReactHashTag
                  renderHashtag={(hashtagValue) => (
                    <Link
                      to={
                        hashtagValue in themeSubTitles
                          ? "/circle/theme/" + hashtagValue.substr(1)
                          : "/circle"
                      }
                      className={classes.hashTag}
                    >
                      {hashtagValue}
                    </Link>
                  )}
                >
                  {t}
                </ReactHashTag>
              ) : (
                <Linkify
                  properties={{
                    target: "_blank",
                    style: {
                      color: theme.palette.secondary.main,
                      textDecoration: "none",
                    },
                  }}
                >
                  {t}
                </Linkify>
              )}
              {index === lineNumber - 1 && (
                <div
                  className={classes.more}
                  onClick={() => setHideText(false)}
                >
                  {"查看更多"}
                </div>
              )}
            </div>
          ))
        : lines.map((t, index) => (
            <div key={t + index} className={classes.text}>
              {t === "" ? (
                <br />
              ) : t.includes("#") ? (
                <ReactHashTag
                  renderHashtag={(hashtagValue) => (
                    <Link
                      to={
                        hashtagValue in themeSubTitles
                          ? "/circle/theme/" + hashtagValue.substr(1)
                          : "/circle"
                      }
                      className={classes.hashTag}
                    >
                      {hashtagValue}
                    </Link>
                  )}
                >
                  {t}
                </ReactHashTag>
              ) : (
                <Linkify
                  properties={{
                    target: "_blank",
                    style: {
                      color: theme.palette.secondary.main,
                      textDecoration: "none",
                    },
                  }}
                >
                  {t}
                </Linkify>
              )}
            </div>
          ))}
    </>
  );
};

export { ParsedText };
