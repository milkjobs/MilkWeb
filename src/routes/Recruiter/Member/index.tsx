import { PublicRecruiter } from "@frankyjuang/milkapi-client";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import logo from "assets/milk.png";
import { Header } from "components/Header";
import { Title } from "components/Util";
import { webConfig } from "config";
import QRCode from "qrcode.react";
import qs from "qs";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "stores";
import urljoin from "url-join";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "900px",
    },
  },
  avatarCell: {
    width: 72,
    padding: 16,
  },
  editCell: {
    width: 80,
    padding: 16,
  },
  qrcode: {
    marginTop: 16,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionCard: {
    flex: 1,
    margin: 16,
    borderWidth: 2,
  },
  selectedPermissionCard: {
    flex: 1,
    margin: 16,
    borderWidth: 2,
    borderColor: theme.palette.secondary.main,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  shareLink: {
    display: "flex",
    justifyContent: "space-bewteen",
    padding: 16,
    backgroundColor: theme.palette.divider,
    overflow: "hidden",
    borderRadius: 8,
    maxWidth: "100%",
    marginTop: 8,
    marginBottom: 16,
    cursor: "pointer",
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 450,
  },
}));

const Member: React.FC = () => {
  const { getApi, user, reloadUser } = useAuth();
  const classes = useStyles();
  const [recruiters, setRecruiters] = useState<PublicRecruiter[]>([]);
  const [invitationUrl, setInvitationUrl] = useState<string>();
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<PublicRecruiter>();
  const [editingIsAdmin, setEditingIsAdmin] = useState(false);

  const getInvitationUrl = useCallback(async () => {
    const team = user?.recruiterInfo?.team;
    if (!team) {
      throw new Error("Failed to get invitation data");
    }

    const teamApi = await getApi("Team");
    const invitation = await teamApi.generateInvitation({
      teamId: team.uuid,
    });
    const data = {
      teamId: team.uuid,
      code: invitation.code,
      expiresTime: invitation.expiresAt.getTime(),
    };
    const url = urljoin(webConfig.basePath, "join", `?${qs.stringify(data)}`);

    setInvitationUrl(url);
    setInvitationDialogOpen(true);
  }, [getApi, user]);

  const getTeamRecruiters = useCallback(async () => {
    const teamId = user?.recruiterInfo?.team?.uuid;
    if (teamId) {
      const teamApi = await getApi("Team");
      const fetchedRecruiters = await teamApi.getTeamRecruiters({
        teamId,
      });
      fetchedRecruiters && setRecruiters(fetchedRecruiters);
    }
  }, [getApi, user]);

  const updatePermission = useCallback(async () => {
    const teamId = user?.recruiterInfo?.team?.uuid;
    if (!teamId || !editingRecruiter) {
      return;
    }
    if (!editingRecruiter.isAdmin === !editingIsAdmin) {
      return;
    }

    const teamApi = await getApi("Team");
    await teamApi.updateRecruiterPermission({
      teamId,
      recruiterInfoId: editingRecruiter.uuid,
      isAdmin: editingIsAdmin,
    });

    if (editingRecruiter.uuid === user?.recruiterInfo?.uuid) {
      await reloadUser();
    }

    await getTeamRecruiters();
  }, [
    editingIsAdmin,
    editingRecruiter,
    getApi,
    getTeamRecruiters,
    reloadUser,
    user,
  ]);

  const removeRecruiter = useCallback(async () => {
    const teamId = user?.recruiterInfo?.team?.uuid;
    if (!teamId || !editingRecruiter) {
      return;
    }

    setDeleteLoading(true);
    const teamApi = await getApi("Team");
    await teamApi.removeRecruiterFromTeam({
      teamId,
      recruiterInfoId: editingRecruiter.uuid,
    });
    await getTeamRecruiters();
    setDeleteLoading(false);
  }, [editingRecruiter, getApi, getTeamRecruiters, user]);

  useEffect(() => {
    getTeamRecruiters();
  }, [getTeamRecruiters]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <Title
          text="成員"
          buttonText="新增成員"
          buttonOnClick={getInvitationUrl}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.avatarCell} />
                <TableCell>名稱</TableCell>
                <TableCell>職位</TableCell>
                <TableCell>權限</TableCell>
                {user?.recruiterInfo?.isAdmin && (
                  <TableCell className={classes.editCell} align="center">
                    編輯
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {recruiters.map((r) => (
                <TableRow key={r.uuid}>
                  <TableCell className={classes.avatarCell}>
                    <Avatar
                      alt="recruiter profile image"
                      src={r.profileImageUrl}
                    />
                  </TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.title || "-"}</TableCell>
                  <TableCell>{r.isAdmin ? "管理員" : "人資"}</TableCell>
                  {user?.recruiterInfo?.isAdmin && (
                    <TableCell className={classes.editCell}>
                      {
                        // Only one admin is not editable.
                        r.isAdmin &&
                        recruiters.filter((x) => x.isAdmin).length === 1 ? (
                          <Tooltip title="不可編輯公司唯一的管理員">
                            <span>
                              <IconButton disabled>
                                <Edit />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <IconButton
                            onClick={() => {
                              setEditingRecruiter(r);
                              setEditingIsAdmin(r.isAdmin);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        )
                      }
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={invitationDialogOpen}
          onClose={() => setInvitationDialogOpen(false)}
          fullWidth
        >
          <DialogTitle>新增公司成員</DialogTitle>
          <DialogContent>
            {invitationUrl && (
              <>
                <div className={classes.title}>邀請連結</div>
                <div>將以下連結分享給同事，同事點選後，便可以加入公司</div>
                <div
                  className={classes.shareLink}
                  onClick={() => {
                    toast.success("已複製邀請連結到剪貼簿");
                    navigator.clipboard.writeText(invitationUrl);
                  }}
                >
                  <div className={classes.truncate}>{invitationUrl}</div>
                  <FileCopyIcon style={{ marginLeft: "auto" }} />
                </div>
              </>
            )}
            <div className={classes.title}>邀請 QRCode</div>
            <div>1. 安裝【牛奶找工作】App</div>
            <div>2. 掃描下方 QR Code 加入</div>
            {invitationUrl && (
              <div className={classes.qrcode}>
                <QRCode
                  size={256}
                  level="Q"
                  value={invitationUrl}
                  imageSettings={{ src: logo, height: 50, width: 50 }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setInvitationDialogOpen(false)}
              color="primary"
            >
              了解
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>編輯{editingRecruiter?.name || ""}權限</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex" }}>
              <Card
                variant="outlined"
                className={
                  editingIsAdmin
                    ? classes.selectedPermissionCard
                    : classes.permissionCard
                }
              >
                <CardActionArea
                  style={{ height: "100%" }}
                  onClick={() => {
                    setEditingIsAdmin(true);
                  }}
                >
                  <CardHeader
                    title="管理員"
                    subheader="人資的所有權限、編輯公司成員權限、編輯公司簡介、購買點閱人數、刪除公司。"
                  />
                </CardActionArea>
              </Card>
              <Card
                variant="outlined"
                className={
                  !editingIsAdmin
                    ? classes.selectedPermissionCard
                    : classes.permissionCard
                }
              >
                <CardActionArea
                  style={{ height: "100%" }}
                  onClick={() => {
                    setEditingIsAdmin(false);
                  }}
                >
                  <CardHeader
                    title="人資"
                    subheader="刊登、編輯、刪除自己新增的職缺。"
                  />
                </CardActionArea>
              </Card>
            </div>
          </DialogContent>
          <DialogActions>
            {editingRecruiter?.uuid !== user?.recruiterInfo?.uuid && (
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                color="secondary"
                style={{ marginRight: "auto" }}
              >
                移除
              </Button>
            )}
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              取消
            </Button>
            <Button
              onClick={async () => {
                await updatePermission();
                setEditDialogOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              確認
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogContent style={{ marginTop: 16, marginBottom: 16 }}>
            確定要移除{editingRecruiter?.name || ""}？
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              取消
            </Button>
            {deleteLoading ? (
              <CircularProgress
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              />
            ) : (
              <Button
                onClick={async () => {
                  await removeRecruiter();
                  setDeleteDialogOpen(false);
                  setEditDialogOpen(false);
                }}
                variant="contained"
                color="secondary"
              >
                移除
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Member;
