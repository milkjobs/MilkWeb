import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUploadOutlined } from "@material-ui/icons";
import to from "await-to-js";
import { Header } from "components/Header";
import { PdfMimeType } from "helpers";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "stores";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 30,
    marginBottom: 30,
    paddingLeft: 24,
    paddingRight: 24,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "900px",
      paddingRight: 0,
      paddingLeft: 0
    }
  },
  titleContainer: {
    display: "flex",
    marginBottom: 12
  },
  title: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    color: theme.palette.text.primary,
    fontSize: 24,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    }
  },
  button: {
    marginLeft: 8
  },
  body: {
    display: "flex",
    flex: 1
  },
  pdfDocument: {
    flex: 1
  },
  pdfPage: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2)"
  },
  dropzone: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 24,
    fontWeight: 400,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 48,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    }
  },
  uploadIcon: {
    flexGrow: 1,
    width: "100%"
  }
}));

const Resume: React.FC = () => {
  const classes = useStyles();
  const { getApi, user, reloadUser } = useAuth();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyWidth, setBodyWidth] = useState<number>();
  const [numPages, setNumPages] = useState<number>();
  const [resumeUrl, setResumeUrl] = useState<string>();

  const upload = useCallback(
    async (files: File[] | FileList) => {
      if (files.length === 0) {
        return;
      }
      if (!user || !user.profile) {
        return;
      }

      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 5MB");
        return;
      }

      const profileApi = await getApi("Profile");
      const [err] = await to(
        profileApi.uploadResume({
          profileId: user.profile.uuid,
          file,
          filename: file.name
        })
      );
      if (err) {
        toast.error("上傳失敗，請稍後再試");
        return;
      }
      toast.success("上傳成功");
      await reloadUser();
    },
    [getApi, reloadUser, user]
  );

  const remove = useCallback(async () => {
    if (user && user.profile && user.profile.resumeKey) {
      const profileApi = await getApi("Profile");
      await profileApi.removeResume({
        profileId: user.profile.uuid,
        resumeKey: user.profile.resumeKey
      });
      setResumeUrl(undefined);
    }
  }, [getApi, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: upload,
    accept: PdfMimeType
  });

  useEffect(() => {
    bodyRef.current && setBodyWidth(bodyRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    const updateResumeUrl = async () => {
      if (user && user.profile && user.profile.resumeKey) {
        const profileApi = await getApi("Profile");
        const url = await profileApi.getResumeUrl({
          profileId: user.profile.uuid,
          resumeKey: user.profile.resumeKey
        });
        setResumeUrl(url);
      }
    };
    updateResumeUrl();
  }, [getApi, user]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <div className={classes.title}>履歷</div>
          {resumeUrl && (
            <>
              <input
                accept={PdfMimeType}
                hidden
                id="contained-button-file"
                onChange={e => {
                  e.target.files && upload(e.target.files);
                }}
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button
                  className={classes.button}
                  color="primary"
                  component="span"
                  variant="contained"
                >
                  重新上傳
                </Button>
              </label>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                href={resumeUrl}
              >
                下載
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={remove}
                variant="contained"
              >
                刪除
              </Button>
            </>
          )}
        </div>
        <div className={classes.body} ref={bodyRef}>
          {resumeUrl ? (
            <Document
              className={classes.pdfDocument}
              file={resumeUrl}
              loading="載入中"
              noData="無法載入履歷"
              onLoadSuccess={doc => {
                setNumPages(doc.numPages);
              }}
            >
              {bodyWidth &&
                numPages &&
                Array.from({ length: numPages }, (v, k) => k).map(x => (
                  <Page
                    key={x}
                    pageIndex={x}
                    className={classes.pdfPage}
                    width={bodyWidth}
                  />
                ))}
            </Document>
          ) : (
            <div {...getRootProps()} className={classes.dropzone}>
              <input {...getInputProps()} />
              <CloudUploadOutlined
                color="primary"
                className={classes.uploadIcon}
              />
              <div>
                {isDragActive
                  ? "放開後立即上傳履歷"
                  : "將檔案拖放到這裡或點一下上傳"}
              </div>
            </div>
          )}
        </div>
        <ToastContainer
          position={ToastPosition.BOTTOM_CENTER}
          draggable={false}
          hideProgressBar
          transition={Slide}
        />
      </div>
    </div>
  );
};

export default Resume;
