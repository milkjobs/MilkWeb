import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  isOpen: boolean;
  close: () => void;
  resumeUrl?: string;
}

const useStyles = makeStyles(theme => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  pdfDocument: {
    flex: 1
  },
  pdfPage: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2)"
  },
  downloadButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: 4,
    textDecoration: "none",
    padding: 16,
    marginTop: 32
  }
}));

const ResumeDialog: React.FC<Props> = props => {
  const { isOpen, close, resumeUrl } = props;
  const classes = useStyles();
  const [numPages, setNumPages] = useState<number>();

  return (
    <Dialog fullWidth maxWidth={"md"} open={isOpen} onClose={close}>
      <DialogContent className={classes.dialogContent}>
        {resumeUrl ? (
          <>
            <Document
              className={classes.pdfDocument}
              file={resumeUrl}
              loading="載入中"
              noData="無法載入履歷"
              onLoadSuccess={doc => {
                setNumPages(doc.numPages);
              }}
            >
              {numPages &&
                Array.from({ length: numPages }, (v, k) => k).map(x => (
                  <Page
                    key={x}
                    pageIndex={x}
                    className={classes.pdfPage}
                    width={900}
                  />
                ))}
            </Document>
            <a href={resumeUrl} className={classes.downloadButton}>
              下載
            </a>
          </>
        ) : (
          <div>{"連結已經失效"}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ResumeDialog };
