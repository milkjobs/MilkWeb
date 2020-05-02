import { TeamSize, Role } from "@frankyjuang/milkapi-client";
import { InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { SubArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import to from "await-to-js";
import { TeamSizeOptions } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "stores";
import firebase from "firebase";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const TeamCreateForm: React.FC<Props> = ({ open, handleClose }) => {
  const history = useHistory();
  const { getApi, user, reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [unifiedNumber, setUnifiedNumber] = useState<string>();
  const [unifiedNumberErrorMessage, setUnifiedNumberErrorMessage] = useState<
    string
  >();
  const [email, setEmail] = useState<string>();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();
  const [nickname, setNickname] = useState<string>();
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>();
  const [area, setArea] = useState<string>();
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string>();
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState<string>();
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [size, setSize] = useState<TeamSize>();
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>();
  const [fieldTagOptions, setFieldTagOptions] = useState<string[]>([]);
  const [primaryField, setPrimaryField] = useState<string>();
  const [primaryFieldErrorMessage, setPrimaryFieldErrorMessage] = useState<
    string
  >();
  const [secondaryField, setSecondaryField] = useState<string>();

  const isValidEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidUnifiedNumber = (unifiedNumber: string) => {
    const invalidList = "00000000,11111111";
    if (
      !/^\d{8}$/.test(unifiedNumber) ||
      invalidList.indexOf(unifiedNumber) !== -1
    ) {
      return false;
    }

    const validateOperator = [1, 2, 1, 2, 1, 2, 4, 1];
    let sum = 0;
    const calculate = (product) => {
      // 個位數 + 十位數
      const ones = product % 10;
      const tens = (product - ones) / 10;
      return ones + tens;
    };
    for (let i = 0; i < validateOperator.length; i++) {
      sum += calculate(parseInt(unifiedNumber[i]) * validateOperator[i]);
    }

    return sum % 10 === 0 || (unifiedNumber[6] === "7" && (sum + 1) % 10 === 0);
  };

  useEffect(() => {
    const getFieldTagOptions = async () => {
      if (unifiedNumber && isValidUnifiedNumber(unifiedNumber)) {
        const verificationApi = await getApi("Verification");
        const [, result] = await to(
          verificationApi.getCommerce({ unifiedNumber })
        );
        if (result) setFieldTagOptions(result.fields);
        else {
          const teamApi = await getApi("Team");
          const [, fields] = await to(teamApi.getFields());
          fields && setFieldTagOptions(fields);
        }
      } else {
        setFieldTagOptions([]);
      }
    };

    getFieldTagOptions();
  }, [unifiedNumber, getApi]);

  const saveEmail = async () => {
    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser) {
      const userId = firebaseUser.uid;
      const userApi = await getApi("User");
      const [recruiter] = await Promise.all([
        userApi.getUser({ userId, role: Role.Recruiter }),
      ]);
      if (recruiter?.recruiterInfo?.uuid && email) {
        const recruiterInfoApi = await getApi("RecruiterInfo");
        await recruiterInfoApi.updateRecruiterInfo({
          recruiterInfoId: recruiter.recruiterInfo.uuid,
          recruiterInfo: {
            ...recruiter.recruiterInfo,
            email,
          },
        });
      }
    }
    await reloadUser();
  };

  const create = async () => {
    const teamApi = await getApi("Team");
    if (!unifiedNumber) {
      setUnifiedNumberErrorMessage("請輸入統一編號");
      return;
    }
    if (!isValidUnifiedNumber(unifiedNumber)) {
      setUnifiedNumberErrorMessage("請輸入正確的統一編號");
      return;
    }
    if (!email) {
      setEmailErrorMessage("請輸入聯絡 Email");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailErrorMessage("請輸入正確的 Email");
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
          secondaryField,
        },
      });
      await saveEmail();
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

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailErrorMessage("");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 20) {
      setNicknameErrorMessage("公司名稱長度不能超過 20 個字");
      return;
    }
    setNickname(event.target.value);
    setNicknameErrorMessage("");
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(event.target.value);
    setAreaErrorMessage("");
    const selectedMainArea = TaiwanAreaJSON.find(
      (a) => a.name === event.target.value
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

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find((a) => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
  }, [area]);

  return (
    <div>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle id="create-team">創建公司</DialogTitle>
        <DialogContent>
          <TextField
            error={Boolean(unifiedNumberErrorMessage)}
            fullWidth
            helperText={unifiedNumberErrorMessage}
            id="unified-number"
            label="統一編號"
            margin="normal"
            onChange={handleUnifiedNumberChange}
            value={unifiedNumber || ""}
            onBlur={() => {
              if (unifiedNumber && !isValidUnifiedNumber(unifiedNumber)) {
                setUnifiedNumberErrorMessage("請輸入正確的統一編號");
              }
            }}
          />
          <TextField
            error={Boolean(nicknameErrorMessage)}
            fullWidth
            id="name"
            label="名稱"
            margin="normal"
            onChange={handleNameChange}
            value={nickname || ""}
            helperText={
              nicknameErrorMessage ||
              "讓人才快速找到你，公司名稱可以是全名簡寫、知名產品名稱或品牌名稱，提交後不能修改。例：【牛奶找工作】是【牛奶網路有限公司】的簡稱"
            }
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
              value={area || ""}
            >
              {TaiwanAreaJSON.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={subAreaOptions.length === 0}
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
              {subAreaOptions.map((option) => (
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
            value={street || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  style={{
                    width: "25%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  position="start"
                >
                  {(area || "縣市") + (subArea || "地區")}
                </InputAdornment>
              ),
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
            value={size || ""}
          >
            {TeamSizeOptions.map((option) => (
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
            value={primaryField || ""}
          >
            {fieldTagOptions.map((option) => (
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
              .filter((o) => o !== primaryField)
              .map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            error={Boolean(emailErrorMessage)}
            fullWidth
            helperText={emailErrorMessage}
            id="unified-number"
            label="聯絡 Email"
            margin="normal"
            onChange={handleEmailChange}
            value={email || ""}
            onBlur={() => {
              if (email && !isValidEmail(email)) {
                setEmailErrorMessage("請輸入正確的 Email");
              }
            }}
          />
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
            <Button onClick={create} color="primary" variant="contained">
              創建
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { TeamCreateForm };
