import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import to from "await-to-js";
import { ImageMimeType } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    marginBottom: 8,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      width: "600px"
    }
  },
  info: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 24
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.palette.text.primary
  },
  detail: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A"
  },
  description: {
    display: "flex",
    whiteSpace: "pre-line",
    textAlign: "left",
    flex: 1,
    fontSize: 16,
    marginTop: 32,
    color: theme.palette.text.secondary
  },
  button: {
    marginLeft: theme.spacing(2)
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 115
  },
  formTextInput: {
    marginBottom: 12
  }
}));

interface DialogProps {
  isOpen: boolean;
  close: () => void;
}

const EditDialog: React.FC<DialogProps> = props => {
  const { isOpen, close } = props;
  const classes = useStyles();
  const { getApi, reloadUser, user } = useAuth();
  const [name, setName] = useState<string>();
  const [introduction, setIntroduction] = useState<string>();
  const [nameErrorMessage, setNameErrorMessage] = useState<string>();
  const [introductionErrorMessage, setIntroductionErrorMessage] = useState<
    string
  >();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 20) {
      setNameErrorMessage("姓名長度不能超過 20 個字");
      return;
    }
    setName(event.target.value);
    setNameErrorMessage(undefined);
  };

  const handleIntroductionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 2000) {
      setIntroductionErrorMessage("自我介紹長度不能超過 2000 個字");
      return;
    }
    setIntroduction(event.target.value);
    setIntroductionErrorMessage(undefined);
  };

  const checkName = () => {
    const helperText = !name ? "姓名不得為空" : undefined;
    setNameErrorMessage(helperText);

    return !helperText;
  };

  const saveChanges = async () => {
    if (!checkName() || !name) {
      return;
    }

    let changed = false;
    if (user && user.name !== name) {
      changed = true;
      const userApi = await getApi("User");
      await userApi.updateUser({ userId: user.uuid, user: { ...user, name } });
    }
    if (user && user.profile && user.profile.introduction !== introduction) {
      changed = true;
      const profileApi = await getApi("Profile");
      await profileApi.updateProfile({
        profileId: user.profile.uuid,
        profile: {
          ...user.profile,
          introduction
        }
      });
    }
    changed && (await reloadUser());

    close();
  };

  const uploadProfileImage = useCallback(
    async (files: File[] | FileList) => {
      if (files.length === 0) {
        return;
      }
      if (!user) {
        return;
      }

      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 1MB");
        return;
      }

      const userApi = await getApi("User");
      const [err] = await to(
        userApi.uploadUserProfileImage({
          userId: user.uuid,
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

  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.profile) {
        setIntroduction(user.profile.introduction);
      }
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>編輯個人資料</DialogTitle>
      <DialogContent>
        {user && (
          <div style={{ display: "flex", marginBottom: 24 }}>
            <Avatar
              src={user.profileImageUrl}
              style={{ width: 60, height: 60 }}
            />
            <input
              hidden
              accept={ImageMimeType}
              id="file-upload"
              onChange={e => {
                e.target.files && uploadProfileImage(e.target.files);
              }}
              type="file"
            />
            <label htmlFor="file-upload">
              <Button
                className={classes.button}
                color="primary"
                component="span"
              >
                上傳大頭貼
              </Button>
            </label>
            <ToastContainer
              draggable={false}
              hideProgressBar
              position={ToastPosition.BOTTOM_CENTER}
              transition={Slide}
            />
          </div>
        )}
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!nameErrorMessage}
          fullWidth
          helperText={nameErrorMessage || ""}
          id="name"
          label="姓名"
          margin="normal"
          onBlur={checkName}
          onChange={handleNameChange}
          value={name}
        />
        <TextField
          error={!!introductionErrorMessage}
          fullWidth
          helperText={introductionErrorMessage || ""}
          id="introduction"
          label="自我介紹"
          margin="normal"
          multiline
          onBlur={() => setIntroductionErrorMessage(undefined)}
          onChange={handleIntroductionChange}
          rows="8"
          value={introduction}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary" variant="text">
          取消
        </Button>
        <Button onClick={saveChanges} color="primary">
          儲存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ApplicantBasicInfo: React.FC = () => {
  const { user } = useAuth();
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Avatar src={user.profileImageUrl} style={{ width: 60, height: 60 }} />
        <div className={classes.info}>
          <div
            style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}
          >
            <div className={classes.name}>{user.name}</div>
            <Button
              size="small"
              variant="outlined"
              className={classes.button}
              onClick={showDialog}
            >
              修改資料
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.description}>
        {user.profile?.introduction || "尚無自我介紹"}
      </div>
      <EditDialog isOpen={isDialogOpen} close={closeDialog} />
    </div>
  );
};

export { ApplicantBasicInfo };
