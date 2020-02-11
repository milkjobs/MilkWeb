import { Team, TeamSize } from "@frankyjuang/milkapi-client";
import { InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ImageMimeType } from "helpers";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/styles";
import { SubArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import to from "await-to-js";
import { TeamSizeOptions } from "helpers";
import React, { useEffect, useState, useCallback } from "react";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import { useHistory } from "react-router";
import { useAuth } from "stores";

const useStyles = makeStyles(() =>
  createStyles({
    logo: {
      objectFit: "contain",
      width: 50,
      height: 50
    },
    button: {
      marginLeft: 16,
      maxWidth: 300
    }
  })
);

interface Props {
  open: boolean;
  handleClose: () => void;
  team: Team;
}

const TeamEditForm: React.FC<Props> = ({ open, handleClose, team }) => {
  const classes = useStyles();
  const history = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { getApi, user, reloadUser } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState(team.address.area);
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string | undefined>(
    team.address.subArea
  );
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState(team.address.street);
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [size, setSize] = useState(team.size);
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>();
  const [fieldTagOptions, setFieldTagOptions] = useState<string[]>([]);
  const [primaryField, setPrimaryField] = useState(team.primaryField);
  const [primaryFieldErrorMessage, setPrimaryFieldErrorMessage] = useState<
    string
  >();
  const [secondaryField, setSecondaryField] = useState<string | undefined>(
    team.secondaryField
  );
  const [website, setWebsite] = useState<string | undefined>(team.website);
  const [websiteErrorMessage, setWebsiteErrorMessage] = useState<string>();
  const [introduction, setIntroduction] = useState<string | undefined>(
    team.introduction
  );
  const [introductionErrorMessage, setIntroductionErrorMessage] = useState<
    string
  >();

  useEffect(() => {
    const getFieldTagOptions = async () => {
      const verificationApi = await getApi("Verification");
      const [, result] = await to(
        verificationApi.getCommerce({
          unifiedNumber: team.unifiedNumber
        })
      );
      result && setFieldTagOptions(result.fields);
    };

    getFieldTagOptions();
  }, [getApi, team.unifiedNumber]);

  const edit = async () => {
    const teamApi = await getApi("Team");
    if (!area) {
      setAreaErrorMessage("請選擇縣市");
      return;
    }
    if (!subArea) {
      setSubAreaErrorMessage("請選擇地區");
      return;
    }
    if (!street) {
      setStreetErrorMessage("請輸入地址");
      return;
    }
    if (!size) {
      setSizeErrorMessage("請選擇公司人數");
      return;
    }
    if (!primaryField) {
      setPrimaryFieldErrorMessage("請選擇產業領域");
      return;
    }
    if (user && user.recruiterInfo && user.recruiterInfo.uuid) {
      setLoading(true);
      await teamApi.updateTeam({
        teamId: team.uuid,
        team: {
          ...team,
          address: { area, subArea, street },
          size,
          primaryField,
          secondaryField,
          website,
          introduction
        }
      });
      await reloadUser();
      setLoading(false);
    }
    handleClose();
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(event.target.value);
    setAreaErrorMessage("");
    const selectedMainArea = TaiwanAreaJSON.find(
      a => a.name === event.target.value
    );
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
    setSubArea(undefined);
  };

  const handleSubAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubArea(event.target.value);
    setSubAreaErrorMessage("");
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setStreetErrorMessage("地址最長不能超過 100 個字");
      return;
    }
    setStreet(event.target.value);
    setStreetErrorMessage("");
  };

  const handlePrimaryFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrimaryField(event.target.value);
    setPrimaryFieldErrorMessage("");
    if (event.target.value === secondaryField) setSecondaryField(undefined);
  };

  const handleSecondaryFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSecondaryField(
      event.target.value === "無" ? undefined : event.target.value
    );
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value === TeamSize.ExtraSmall ||
      event.target.value === TeamSize.Small ||
      event.target.value === TeamSize.Medium ||
      event.target.value === TeamSize.Large ||
      event.target.value === TeamSize.ExtraLarge
    ) {
      setSize(event.target.value);
      setSizeErrorMessage("");
    }
  };

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 2048) {
      setWebsiteErrorMessage("公司網站最長不能超過 2048 個字");
      return;
    }
    setWebsite(event.target.value);
    setWebsiteErrorMessage("");
  };

  const handleIntroductionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 2000) {
      setIntroductionErrorMessage("介紹最長不能超過 2000 個字");
      return;
    }
    setIntroduction(event.target.value);
    setIntroductionErrorMessage("");
  };

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
  }, [area]);

  const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const removeTeam = async () => {
    setDeleteLoading(true);
    const teamApi = await getApi("Team");
    await teamApi.removeTeam({ teamId: team.uuid });
    await reloadUser();
    setDeleteLoading(false);
    handleDeleteDialogClose();
    history.push("/");
  };

  const uploadLogo = useCallback(
    async (files: File[] | FileList) => {
      if (files.length === 0) {
        return;
      }
      if (!user || !user.recruiterInfo || !user.recruiterInfo.team) {
        return;
      }

      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 1MB");
        return;
      }

      const teamApi = await getApi("Team");
      const [err] = await to(
        teamApi.uploadTeamLogo({
          teamId: user.recruiterInfo.team.uuid,
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

  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth open={open} onClose={handleClose}>
        <DialogTitle id="edit-team">編輯公司</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex" }}>
            <img alt="team logo" src={team.logoUrl} className={classes.logo} />
            <input
              hidden
              accept={ImageMimeType}
              id="file-upload"
              onChange={e => {
                e.target.files && uploadLogo(e.target.files);
              }}
              type="file"
            />
            <label htmlFor="file-upload">
              <Button
                className={classes.button}
                color="primary"
                component="span"
              >
                上傳 Logo
              </Button>
            </label>
            <ToastContainer
              draggable={false}
              hideProgressBar
              position={ToastPosition.BOTTOM_CENTER}
              transition={Slide}
            />
          </div>
          <TextField
            disabled
            fullWidth
            id="unified-number"
            label="統一編號"
            margin="normal"
            value={team.unifiedNumber}
          />
          <TextField
            disabled
            fullWidth
            id="name"
            label="名稱"
            margin="normal"
            value={team.nickname}
          />
          <div style={{ display: "flex" }}>
            <TextField
              error={Boolean(areaErrorMessage)}
              fullWidth
              helperText={areaErrorMessage}
              id="area"
              label="縣市"
              margin="normal"
              onChange={handleAreaChange}
              select
              style={{ marginRight: 4 }}
              value={area}
            >
              {TaiwanAreaJSON.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              error={Boolean(subAreaErrorMessage)}
              fullWidth
              helperText={subAreaErrorMessage}
              id="sub-area"
              label="地區"
              margin="normal"
              onChange={handleSubAreaChange}
              select
              style={{ marginLeft: 4 }}
              value={subArea || ""}
            >
              {subAreaOptions.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            error={Boolean(streetErrorMessage)}
            fullWidth
            helperText={streetErrorMessage}
            id="street"
            label="地址"
            margin="normal"
            onChange={handleAddressChange}
            value={street}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  style={{
                    width: "25%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                  position="start"
                >
                  {(area || "縣市") + (subArea || "地區")}
                </InputAdornment>
              )
            }}
          />
          <TextField
            error={Boolean(sizeErrorMessage)}
            fullWidth
            helperText={sizeErrorMessage}
            id="size"
            label="人數"
            margin="normal"
            onChange={handleSizeChange}
            select
            value={size}
          >
            {TeamSizeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={fieldTagOptions.length === 0}
            error={Boolean(primaryFieldErrorMessage)}
            fullWidth
            helperText={primaryFieldErrorMessage}
            id="primary-field"
            label="產業領域"
            margin="normal"
            onChange={handlePrimaryFieldChange}
            select
            value={primaryField}
          >
            {fieldTagOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={fieldTagOptions.length === 0}
            fullWidth
            id="secondary-field"
            label="產業次要領域（選填）"
            margin="normal"
            onChange={handleSecondaryFieldChange}
            select
            value={secondaryField || ""}
          >
            {secondaryField && <MenuItem value="無">無</MenuItem>}
            {fieldTagOptions
              .filter(o => o !== primaryField)
              .map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            error={Boolean(websiteErrorMessage)}
            fullWidth
            helperText={websiteErrorMessage}
            id="website"
            label="網站（選填）"
            margin="normal"
            onChange={handleWebsiteChange}
            value={website || ""}
          />
          <TextField
            error={Boolean(introductionErrorMessage)}
            fullWidth
            helperText={introductionErrorMessage}
            id="introduction"
            label="介紹（選填）"
            margin="normal"
            multiline
            onChange={handleIntroductionChange}
            rows="10"
            rowsMax="10"
            value={introduction || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteDialogOpen}
            color="secondary"
            style={{ marginRight: "auto" }}
          >
            刪除
          </Button>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          {loading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button onClick={edit} color="primary" variant="contained">
              儲存
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogContent style={{ marginTop: 16, marginBottom: 16 }}>
          你確定要刪除公司嗎？刪除後，可使用的點閱人數也會全部刪除。
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          {deleteLoading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button
              style={{
                boxShadow: "none",
                color: "white"
              }}
              onClick={removeTeam}
              variant="contained"
              color="secondary"
              autoFocus
            >
              確定
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { TeamEditForm };
