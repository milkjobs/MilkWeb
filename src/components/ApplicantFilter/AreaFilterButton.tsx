import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { MainArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import React, { useEffect, useState } from "react";
import { RefinementListProvided } from "react-instantsearch-core";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { connectRefinementList } from "react-instantsearch-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginHorizontal: 4,
  },
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
  filterButton: {
    minWidth: 60,
    borderColor: theme.palette.divider,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    marginRight: 8,
  },
  typography: {
    cursor: "pointer",
    padding: theme.spacing(2),
  },
  selectedTypography: {
    color: theme.palette.secondary.main,
    cursor: "pointer",
    padding: theme.spacing(2),
  },
}));

interface AreaFilter {
  area: string;
  subArea: string;
}

export interface AreaFilterDialogProps {
  open: boolean;
  areaFilters: AreaFilter[];
  onClose: (value: AreaFilter[]) => void;
}

const AreaFilterButton: React.FC<RefinementListProvided> = ({ refine }) => {
  const classes = useStyles();
  const [areaFilterList, setAreaFilterList] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    refine(areaFilterList);
  }, [areaFilterList]);

  return (
    <>
      <Button className={classes.filterButton} onClick={handleClick}>
        <div className={classes.filterText}>
          {areaFilterList.length > 0 ? areaFilterList.join("、") : "地區"}
        </div>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{ height: 500 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {TaiwanAreaJSON.map((a) => (
          <Typography
            key={a.name}
            className={
              areaFilterList.includes(a.name)
                ? classes.selectedTypography
                : classes.typography
            }
            onClick={() => {
              if (areaFilterList.includes(a.name)) {
                setAreaFilterList(
                  areaFilterList.filter((area) => area !== a.name)
                );
              } else {
                setAreaFilterList([...areaFilterList, a.name]);
              }
            }}
          >
            {a.name}
          </Typography>
        ))}
      </Popover>
    </>
  );
};

const ConnectedAreaFilterButton = connectRefinementList(AreaFilterButton);

export { ConnectedAreaFilterButton as AreaFilterButton };
