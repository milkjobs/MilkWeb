import { TaiwanAreaJSON, MainArea } from "config";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RefinementListProvided } from "react-instantsearch-core";
import { connectRefinementList } from "react-instantsearch-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import CheckIcon from "@material-ui/icons/Check";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
  container: {
    marginHorizontal: 4,
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
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
  mainArea: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    width: 200,
    backgroundColor: "#f5f5f5",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
    },
  },
  hoverMainArea: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    width: 200,
    cursor: "pointer",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.main,
  },
  subArea: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    width: 200,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
    },
  },
  selectedSubArea: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    width: 200,
    color: theme.palette.secondary.main,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
    },
  },
  selectedHint: {
    color: theme.palette.text.hint,
    marginLeft: 16,
    marginRight: 16,
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

function AreaFilterDialog(props: AreaFilterDialogProps) {
  const classes = useStyles();
  const { onClose, areaFilters, open } = props;
  const [selectedMainArea, setSelectedMainArea] = React.useState<string>();
  const [selectedAreaFilters, setSelectedAreaFilters] = React.useState<
    AreaFilter[]
  >([]);
  const [value, setValue] = React.useState<string>();

  useEffect(() => {
    setSelectedAreaFilters(areaFilters);
  }, [areaFilters]);

  const handleClose = () => {
    onClose(selectedAreaFilters);
  };

  const isAllSubAreasSelected = (
    mainArea: MainArea | undefined,
    filterList: AreaFilter[]
  ) => {
    if (!mainArea) return false;
    for (const dist of mainArea.districts) {
      const found = filterList.find(
        (f) => f.area === mainArea.name && f.subArea === dist.name
      );
      if (!found) {
        return false;
      }
    }
    return true;
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <div style={{ display: "flex", height: 1000 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 800,
            overflow: "scroll",
          }}
        >
          {TaiwanAreaJSON.map((a) => (
            <div
              key={a.name}
              className={
                selectedMainArea === a.name
                  ? classes.hoverMainArea
                  : classes.mainArea
              }
              onMouseOver={() => setSelectedMainArea(a.name)}
            >
              {a.name}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 800,
            overflow: "scroll",
          }}
        >
          <div
            className={
              selectedMainArea &&
              isAllSubAreasSelected(
                TaiwanAreaJSON.find((a) => a.name === selectedMainArea),
                selectedAreaFilters
              )
                ? classes.selectedSubArea
                : classes.subArea
            }
            onClick={() => {
              if (
                selectedMainArea &&
                isAllSubAreasSelected(
                  TaiwanAreaJSON.find((a) => a.name === selectedMainArea),
                  selectedAreaFilters
                )
              ) {
                setSelectedAreaFilters(
                  selectedAreaFilters.filter((f) => f.area !== selectedMainArea)
                );
              } else {
                const appendDistricts = TaiwanAreaJSON.find(
                  (a) => a.name === selectedMainArea
                )?.districts.filter(
                  (d) =>
                    !selectedAreaFilters.find(
                      (f) => f.subArea === d.name && f.area === selectedMainArea
                    )
                );
                selectedMainArea &&
                  appendDistricts &&
                  setSelectedAreaFilters([
                    ...appendDistricts.map((d) => {
                      return { area: selectedMainArea, subArea: d.name };
                    }),
                    ...selectedAreaFilters,
                  ]);
              }
            }}
          >
            {"全部"}
            {selectedMainArea &&
              isAllSubAreasSelected(
                TaiwanAreaJSON.find((a) => a.name === selectedMainArea),
                selectedAreaFilters
              ) && (
                <CheckIcon
                  color="secondary"
                  fontSize="small"
                  style={{ marginLeft: 16, marginTop: 4 }}
                />
              )}
          </div>
          {TaiwanAreaJSON.find(
            (a) => a.name === selectedMainArea
          )?.districts.map((d) => (
            <div
              key={d.name}
              className={
                selectedMainArea &&
                selectedAreaFilters.find(
                  (a) => a.area === selectedMainArea && a.subArea === d.name
                )
                  ? classes.selectedSubArea
                  : classes.subArea
              }
              onClick={() => {
                if (
                  selectedAreaFilters.find(
                    (a) => a.area === selectedMainArea && a.subArea === d.name
                  )
                ) {
                  setSelectedAreaFilters(
                    selectedAreaFilters?.filter(
                      (a) => a.area !== selectedMainArea || a.subArea !== d.name
                    )
                  );
                } else
                  selectedMainArea &&
                    setSelectedAreaFilters([
                      ...selectedAreaFilters,
                      { area: selectedMainArea, subArea: d.name },
                    ]);
              }}
            >
              {d.name}
              {selectedMainArea &&
                selectedAreaFilters.find(
                  (a) => a.area === selectedMainArea && a.subArea === d.name
                ) && (
                  <CheckIcon
                    color="secondary"
                    fontSize="small"
                    style={{ marginLeft: 16, marginTop: 4 }}
                  />
                )}
            </div>
          ))}
        </div>
      </div>
      <DialogActions>
        <div
          style={{ marginRight: "auto", display: "flex", alignItems: "center" }}
        >
          <div
            className={classes.selectedHint}
          >{`已選 ${selectedAreaFilters.length} 個地區`}</div>
          <Button onClick={() => setSelectedAreaFilters([])} color="secondary">
            清除已選的地區
          </Button>
        </div>
        <Button onClick={handleClose} color="primary" autoFocus>
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const convertAreaFilterListToAlgoliaAreaList = (filterList: AreaFilter[]) =>
  filterList.map((filter) => `${filter.area} > ${filter.subArea}`);

const convertAlgoliaAreaListToAreaFilterList = (algoliaList: string[]) =>
  algoliaList
    .filter((value) => value.includes(" > ") && value)
    .map<AreaFilter>((value) => {
      const [area, subArea] = value.split(" > ");
      return { area, subArea };
    });

const AreaFilterButton: React.FC<RefinementListProvided> = ({ refine }) => {
  const classes = useStyles();
  const [areaFilterList, setAreaFilterList] = useState<AreaFilter[]>([]);
  const [areaTitle, setAreaTitle] = useState("");
  const [open, setOpen] = useState(false);

  //   useEffect(() => {
  //     const loadAreaFilterList = async () => {
  //       try {
  //         const rawAreaFilterList = await AsyncStorage.getItem(
  //           AsyncStorageItems.AreaFilterList
  //         );

  //         if (!rawAreaFilterList) {
  //           throw new Error("No asyncstorage area filter list found");
  //         }

  //         const filterList: AreaFilter[] = JSON.parse(rawAreaFilterList);
  //         setAreaFilterList(filterList);
  //       } catch {
  //         // Remove broken area filter list.
  //         AsyncStorage.removeItem(AsyncStorageItems.AreaFilterList);
  //       }
  //       setLoading(false);
  //     };

  //     loadAreaFilterList();
  //   }, []);

  //   useEffect(() => {
  //     const search = async () => {
  //       await loadAlgoliaCredential();
  //       refine(convertAreaFilterListToAlgoliaAreaList(areaFilterList));
  //     };

  //     !loading && search();
  //   }, [areaFilterList, refine, loadAlgoliaCredential, loading]);

  //   useEffect(() => {
  //     const updateAsyncStorage = () => {
  //       if (areaFilterList.length > 0) {
  //         AsyncStorage.setItem(
  //           AsyncStorageItems.AreaFilterList,
  //           JSON.stringify(areaFilterList)
  //         );
  //       } else {
  //         AsyncStorage.removeItem(AsyncStorageItems.AreaFilterList);
  //       }
  //     };

  //     !loading && updateAsyncStorage();
  //   }, [areaFilterList, loading]);

  useEffect(() => {
    const generateAreaTitle = () => {
      // Generates the areaTitle users seen in JobHome

      // 1. Populate a map of area and set of subAreas.
      const areaMap = new Map<string, Set<string>>();
      for (const filter of areaFilterList) {
        const subAreas = areaMap.get(filter.area) || new Set<string>();
        subAreas.add(filter.subArea);
        areaMap.set(filter.area, subAreas);
      }

      // 2. Push fully selected area to titles. Collect the subAreas of
      // partially selected area to otherSubAreas.
      const titles: string[] = [];
      const otherSubAreas = new Set<string>();
      areaMap.forEach((subAreas, area) => {
        const mainArea = TaiwanAreaJSON.find((a) => a.name === area);
        if (!mainArea) {
          return;
        }
        for (const dist of mainArea.districts) {
          if (!subAreas.has(dist.name)) {
            subAreas.forEach((a) => otherSubAreas.add(a));
            return;
          }
        }
        titles.push(area);
      });

      // 3. Push otherSubAreas to titles.
      titles.push(...otherSubAreas.values());

      // 4. Construct title string from titles.
      let title = titles.slice(0, 3).join("、");
      if (titles.length > 3) {
        title += "...";
      }

      setAreaTitle(title);
    };

    generateAreaTitle();
  }, [areaFilterList]);

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>{areaTitle || "地區"}</div>
      </Button>
      <AreaFilterDialog
        open={open}
        onClose={(value: AreaFilter[]) => {
          refine(convertAreaFilterListToAlgoliaAreaList(value));
          setOpen(false);
          setAreaFilterList(value);
        }}
        areaFilters={areaFilterList}
      />
    </>
  );
};

const ConnectedAreaFilterButton = connectRefinementList(AreaFilterButton);

export { ConnectedAreaFilterButton as AreaFilterButton };
