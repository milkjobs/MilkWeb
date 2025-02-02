import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Experience } from "@frankyjuang/milkapi-client";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { zhTW } from "date-fns/locale";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ChipInput from "material-ui-chip-input";
import { JobCatalogues } from "assets/jobs";
import Fuse from "fuse.js";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8,
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 115,
  },
  formTextInput: {
    marginBottom: 12,
  },
}));

interface ExperienceDialogProps {
  experience?: Experience;
  isOpen: boolean;
  create: boolean;
  close: () => void;
  update: (Experience: Experience) => void;
  deleteExperience: (id: string) => void;
}

const ExperienceDialog: React.FC<ExperienceDialogProps> = (props) => {
  const { isOpen, close, update, deleteExperience, create, experience } = props;
  const classes = useStyles();
  const [jobName, setJobName] = useState<string>();
  const [teamName, setTeamName] = useState<string>();
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [current, setCurrent] = React.useState<boolean>(true);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [description, setDescription] = useState<string>();
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [jobNameErrorMessage, setJobNameErrorMessage] = useState<string>();
  const [teamNameErrorMessage, setTeamNameErrorMessage] = useState<string>();
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<
    string
  >();
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>();
  const [titleFuse, setTitleFuse] = useState<
    Fuse<string, Fuse.FuseOptions<string>>
  >();
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>();

  useEffect(() => {
    setJobName(experience ? experience.jobName : undefined);
    setTeamName(experience ? experience.teamName : undefined);
    setStartTime(experience ? experience.startTime : new Date());
    setEndTime(experience ? experience.endTime || null : null);
    setDescription(experience ? experience.description : undefined);
    setSkillTags(experience ? experience.skillTags : []);
    experience && !experience.endTime && setCurrent(true);
    !experience && setCurrent(true);
  }, [experience]);

  useEffect(() => {
    const getTitleOptions = async () => {
      const allTitles = JobCatalogues.reduce<string[]>((result, catalogue) => {
        const subTitles = catalogue.subCatalogues.reduce<string[]>(
          (subResult, subCatalogue) => {
            subResult.push(...subCatalogue.jobs);
            return subResult;
          },
          []
        );
        result.push(...subTitles);
        return result;
      }, []);
      const titles = [...new Set(allTitles)];

      const options: Fuse.FuseOptions<string> = {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
      };
      setTitleFuse(new Fuse(titles, options));
      setTitleOptions(titles);
    };

    getTitleOptions();
  }, []);

  const handleJobNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setJobNameErrorMessage("職位名稱不能超過 100 個字");
      return;
    }
    setJobName(event.target.value);
    setJobNameErrorMessage(undefined);
  };

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setTeamNameErrorMessage("公司名稱不能超過 100 個字");
      return;
    }
    setTeamName(event.target.value);
    setTeamNameErrorMessage(undefined);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 2000) {
      setDescriptionErrorMessage("自我介紹長度不能超過 2000 個字");
      return;
    }
    setDescription(event.target.value);
    setDescriptionErrorMessage(undefined);
  };

  const handleStartTimeChange = (date: Date | null) => {
    setStartTime(date);
  };

  const handleCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.checked);
  };

  const handleEndTimeChange = (date: Date | null) => {
    setEndTime(date);
  };

  const checkJobName = () => {
    const helperText = !jobName ? "職位名稱不得為空" : undefined;
    setJobNameErrorMessage(helperText);

    return !helperText;
  };

  const checkTeamName = () => {
    const helperText = !teamName ? "公司名稱不得為空" : undefined;
    setTeamNameErrorMessage(helperText);

    return !helperText;
  };

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>{create ? "新增經驗" : "編輯經驗"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!jobNameErrorMessage}
          fullWidth
          helperText={jobNameErrorMessage || ""}
          id="name"
          label="職位名稱"
          margin="normal"
          onBlur={checkJobName}
          onChange={handleJobNameChange}
          value={jobName}
        />
        <Autocomplete
          clearText="清除職位"
          closeText="收起清單"
          defaultValue={""}
          getOptionLabel={(option) => option}
          id="titles"
          multiple={false}
          noOptionsText="找不到分類"
          openText="展開清單"
          options={titleOptions}
          value={title}
          onChange={(_event, newValue) => {
            if (newValue) {
              setTitle(newValue);
              setTitleErrorMessage("");
            }
          }}
          filterOptions={(_options, { inputValue }) =>
            inputValue && titleFuse
              ? titleFuse
                  .search<string, false, false>(inputValue)
                  .map((i) => titleOptions[i])
              : titleOptions
          }
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="職位分類" />
          )}
        />
        {Boolean(titleErrorMessage) && (
          <div style={{ color: "#fa6c71" }}>{titleErrorMessage}</div>
        )}
        <TextField
          className={classes.formTextInput}
          error={!!teamNameErrorMessage}
          fullWidth
          helperText={teamNameErrorMessage || ""}
          id="name"
          label="公司名稱"
          margin="normal"
          onBlur={checkTeamName}
          onChange={handleTeamNameChange}
          value={teamName}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            <KeyboardDatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="開始時間"
              value={startTime}
              onChange={handleStartTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 24,
                marginLeft: 16,
              }}
            >
              <Checkbox checked={current} onChange={handleCurrentChange} />
              <div>{"至今"}</div>
            </div>
          </Grid>
        </MuiPickersUtilsProvider>
        {!current && (
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhTW}>
            <Grid container justify="space-between">
              <KeyboardDatePicker
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="結束時間"
                value={endTime}
                onChange={handleEndTimeChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        )}
        <TextField
          error={!!descriptionErrorMessage}
          fullWidth
          helperText={descriptionErrorMessage || ""}
          id="introduction"
          label="介紹"
          margin="normal"
          multiline
          onBlur={() => setDescriptionErrorMessage(undefined)}
          onChange={handleDescriptionChange}
          rows="8"
          value={description}
        />
        <ChipInput
          fullWidth
          value={skillTags}
          onAdd={(chip) => setSkillTags((prev) => [...prev, chip])}
          onDelete={(chip) =>
            setSkillTags((prev) => prev.filter((t) => t !== chip))
          }
          margin="normal"
          label="技能標籤"
        />
      </DialogContent>
      <DialogActions>
        {!create && (
          <Button
            style={{ marginRight: "auto" }}
            onClick={() => {
              experience &&
                experience.uuid &&
                deleteExperience(experience.uuid);
              close();
            }}
            color="secondary"
            variant="text"
          >
            刪除
          </Button>
        )}
        <Button onClick={close} color="primary" variant="text">
          取消
        </Button>
        <Button
          onClick={() => {
            if (!title) {
              setTitleErrorMessage("職位不能為空");
              return;
            }
            jobName &&
              title &&
              teamName &&
              startTime &&
              update({
                uuid: experience?.uuid,
                jobName,
                title,
                teamName,
                startTime,
                endTime,
                description,
                skillTags,
              });
            close();
          }}
          color="primary"
          disabled={!jobName || !teamName || !startTime}
          variant="text"
        >
          {create ? "新增" : "儲存"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { ExperienceDialog };
