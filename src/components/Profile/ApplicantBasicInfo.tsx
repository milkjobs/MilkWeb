import { User } from "@frankyjuang/milkapi-client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
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
  const [nameHelperText, setNameHelperText] = useState<string>();

  const checkName = () => {
    const helperText = !name ? "姓名不得為空" : undefined;
    setNameHelperText(helperText);

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
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!nameHelperText}
          fullWidth
          helperText={nameHelperText || ""}
          id="name"
          label="姓名"
          margin="dense"
          onBlur={checkName}
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <TextField
          fullWidth
          id="introduction"
          label="自我介紹"
          margin="dense"
          multiline
          onChange={e => setIntroduction(e.target.value)}
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

interface Props {
  user: User;
}

const ApplicantBasicInfo: React.FC<Props> = props => {
  const { user } = props;
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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
        <div>
          {user && user.profile && user.profile.introduction
            ? user.profile.introduction
            : "尚無描述"}
        </div>
      </div>
      <EditDialog isOpen={isDialogOpen} close={closeDialog} />
    </div>
  );
};

export { ApplicantBasicInfo };
