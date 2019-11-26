import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/styles";
import { TaiwanAreaJSON, SubArea } from "assets/TaiwanAreaJSON";
import { Theme, InputAdornment } from "@material-ui/core";
import { Team, TeamSize } from "@frankyjuang/milkapi-client";
import { useAuth } from "stores";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router";
import to from "await-to-js";

interface TeamEditFormProps {
  open: boolean;
  handleClose: () => void;
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

const TeamCreateForm: React.FC<TeamEditFormProps> = ({ open, handleClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getApi, user, reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [unifiedNumber, setUnifiedNumber] = useState<string>();
  const [unifiedNumberErrorMessage, setUnifiedNumberErrorMessage] = useState<
    string
  >();
  const [nickname, setNickname] = useState<string>();
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>();
  const [area, setArea] = useState<string>();
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string>();
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState();
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [size, setSize] = useState<TeamSize>();
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>();
  const [fieldTagOptions, setFieldTagOptions] = useState<string[]>([]);
  const [primaryField, setPrimaryField] = useState<string>();
  const [primaryFieldErrorMessage, setPrimaryFieldErrorMessage] = useState<
    string
  >();
  const [secondaryField, setSecondaryField] = useState<string>();

  const getFieldTagOptions = async () => {
    if (unifiedNumber) {
      setLoading(true);
      const verificationApiService = await getApi("Verification");
      const [err, result] = await to(
        verificationApiService.getCommerce({ unifiedNumber })
      );
      result && setFieldTagOptions(result.fields);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFieldTagOptions();
  }, [unifiedNumber]);

  function isValidGUI(taxId) {
    var invalidList = "00000000,11111111";
    if (/^\d{8}$/.test(taxId) == false || invalidList.indexOf(taxId) != -1) {
      return false;
    }

    var validateOperator = [1, 2, 1, 2, 1, 2, 4, 1],
      sum = 0,
      calculate = function(product) {
        // 個位數 + 十位數
        var ones = product % 10,
          tens = (product - ones) / 10;
        return ones + tens;
      };
    for (var i = 0; i < validateOperator.length; i++) {
      sum += calculate(taxId[i] * validateOperator[i]);
    }

    return sum % 10 == 0 || (taxId[6] == "7" && (sum + 1) % 10 == 0);
  }

  const create = async () => {
    const teamApi = await getApi("Team");
    if (!unifiedNumber || !isValidGUI(unifiedNumber)) {
      setUnifiedNumberErrorMessage("請輸入統編");
      return;
    }
    if (!isValidGUI(unifiedNumber)) {
      setUnifiedNumberErrorMessage("請輸入正確的統編");
      return;
    }
    if (!nickname) {
      setNicknameErrorMessage("請輸入名稱");
      return;
    }
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
    if (user) {
      setLoading(true);
      await teamApi.addTeam({
        userId: user.uuid,
        newTeam: {
          unifiedNumber,
          nickname,
          address: { area, subArea, street },
          size,
          primaryField,
          secondaryField
        }
      });
      await reloadUser();
      setLoading(false);
    }
    handleClose();
    history.push("/recruiter/verification");
  };

  const handleUnifiedNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnifiedNumber(event.target.value);
    setUnifiedNumberErrorMessage("");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    setNicknameErrorMessage("");
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

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
  }, [area]);

  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">創建公司</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            id="name"
            label="統編"
            error={Boolean(unifiedNumberErrorMessage)}
            helperText={unifiedNumberErrorMessage}
            value={unifiedNumber}
            onChange={handleUnifiedNumberChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="name"
            error={Boolean(nicknameErrorMessage)}
            helperText={
              nicknameErrorMessage ||
              "讓人才快速找到你，公司名稱可以是全名簡寫、知名產品名稱或品牌名稱，提交後不能修改。例：【牛奶找工作】是【牛奶網路有限公司】的簡稱"
            }
            label="名稱"
            value={nickname}
            onChange={handleNameChange}
            fullWidth
          />
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
            label="產業次要領域（選填）"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          {loading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button onClick={create} color="primary">
              創建
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

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

export { TeamCreateForm };
