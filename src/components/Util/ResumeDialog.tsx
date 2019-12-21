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
  pdfDocument: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto"
  },
  pdfPage: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2)"
  }
}));

const ResumeDialog: React.FC<Props> = props => {
  const { isOpen, close, resumeUrl } = props;
  const classes = useStyles();
  const [numPages, setNumPages] = useState<number>();

  return (
    <Dialog fullWidth maxWidth={"md"} open={isOpen} onClose={close}>
      <DialogContent>
        {resumeUrl && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ResumeDialog };
