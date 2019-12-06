import { Team, TeamSize } from "@frankyjuang/milkapi-client";
import { InputAdornment, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/styles";
import { SubArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import to from "await-to-js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "stores";

interface TeamEditFormProps {
  open: boolean;
  handleClose: () => void;
  team: Team;
}

const SizeTypes = [
  { value: TeamSize.ExtraSmall, label: "0 ~ 20 人" },
  {
    value: TeamSize.Small,
    label: "21 ~ 100 人"
  },
  { value: TeamSize.Medium, label: "101 ~ 500 人" },
  { value: TeamSize.Large, label: "501 ~ 1000 人" },
  { value: TeamSize.ExtraLarge, label: "1001 人以上" }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    menu: {
      width: 200
    }
  })
);

const TeamEditForm: React.FC<TeamEditFormProps> = ({
  open,
  handleClose,
  team
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { getApi, user, reloadUser } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState<string>(team.address.area);
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string | undefined>(
    team.address.subArea
  );
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState(team.address.street);
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [size, setSize] = useState<TeamSize>(team.size);
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>();
  const [fieldTagOptions, setFieldTagOptions] = useState<string[]>([]);
  const [primaryField, setPrimaryField] = useState<string>(team.primaryField);
  const [primaryFieldErrorMessage, setPrimaryFieldErrorMessage] = useState<
    string
  >();
  const [secondaryField, setSecondaryField] = useState<string | undefined>(
    team.secondaryField
  );
  const [website, setWebsite] = useState<string | undefined>(team.website);
  const [introduction, setIntroduction] = useState<string | undefined>(
    team.introduction
  );

  useEffect(() => {
    const getFieldTagOptions = async () => {
      setLoading(true);
      const verificationApiService = await getApi("Verification");
      const [, result] = await to(
        verificationApiService.getCommerce({
          unifiedNumber: team.unifiedNumber
        })
      );
      result && setFieldTagOptions(result.fields);
      setLoading(false);
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
    setSecondaryField(event.target.value);
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
    setWebsite(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIntroduction(event.target.value);
  };

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
  }, [area]);

  const removeTeam = async () => {
    setDeleteLoading(true);
    const teamApi = await getApi("Team");
    await teamApi.removeTeam({ teamId: team.uuid });
    await reloadUser();
    setDeleteLoading(false);
    handleDeleteDialogClose();
    history.push("/");
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">編輯公司</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ marginRight: 4 }}
              error={Boolean(areaErrorMessage)}
              helperText={areaErrorMessage}
              id="standard-select-currency"
              select
              fullWidth
              label="縣市"
              value={area}
              onChange={handleAreaChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {TaiwanAreaJSON.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              style={{ marginLeft: 4 }}
              error={Boolean(subAreaErrorMessage)}
              helperText={subAreaErrorMessage}
              id="standard-select-currency"
              select
              fullWidth
              label="地區"
              value={subArea}
              onChange={handleSubAreaChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
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
            helperText={streetErrorMessage}
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
                  {(area || "") + (subArea || "")}
                </InputAdornment>
              )
            }}
            margin="normal"
            id="name"
            label="地址"
            value={street}
            fullWidth
            onChange={handleAddressChange}
          />
          <TextField
            id="standard-select-currency"
            error={Boolean(sizeErrorMessage)}
            helperText={sizeErrorMessage}
            select
            fullWidth
            label="人數"
            value={size}
            onChange={handleSizeChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {SizeTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="standard-select-currency"
            error={Boolean(primaryFieldErrorMessage)}
            helperText={primaryFieldErrorMessage}
            select
            fullWidth
            label="產業領域"
            value={primaryField}
            onChange={handlePrimaryFieldChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {fieldTagOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="產業次要領域"
            value={secondaryField}
            onChange={handleSecondaryFieldChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {fieldTagOptions
              .filter(o => o !== primaryField)
              .map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="normal"
            id="name"
            label="網站（選填）"
            value={website}
            onChange={handleWebsiteChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="name"
            label="介紹（選填）"
            value={introduction}
            onChange={handleDescriptionChange}
            multiline
            rows="10"
            rowsMax="10"
            fullWidth
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
            <Button onClick={edit} color="primary">
              儲存
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
