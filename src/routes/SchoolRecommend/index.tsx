import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { openInNewTab, checkUrl } from "helpers";

interface Company {
  name: string;
  key: string;
  logoUrl: string;
  link: string;
  description: string;
}

const companies = {
  ee: [
    {
      name: "華碩",
      key: "1",
      logoUrl: "https://www.asus.com/media/img/2017/images/n-logo-asus.svg",
      link: "https://hr-recruit.asus.com/",
      description: "華碩電腦"
    },
    {
      name: "台積電",
      key: "2",
      logoUrl: "https://www.tsmc.com/img/logo.png",
      link:
        "https://tsmc.taleo.net/careersection/tsmc_exti/jobdetail.ftl?job=1900008Z&lang=zh_TW",
      description: "世界第一的半導體設計廠"
    },
    {
      name: "聯發科",
      key: "3",
      logoUrl: "https://cdn-www.mediatek.com/icons/mtklogo.svg",
      link: "https://careers.mediatek.com/eREC/?langKey=zh-TW&langKey=zh-TW",
      description: "無線通訊、高清電視、5G提供系统晶片解決方案的無廠半導體公司"
    },
    {
      name: "聯詠科技",
      key: "4",
      logoUrl: "http://www.novatek.com.tw/templates/default/images/logo.png",
      link: "https://www.104.com.tw/company/12nopku0?jobsource=n104bank1",
      description: "聯詠科技為國內IC設計領導廠商，從事產品設計，研發及銷售。"
    },
    {
      name: "瑞昱半導體",
      key: "5",
      logoUrl: "https://www.realtek.com/images/realtek_logo.png",
      link: "https://recruit.realtek.com/zh/",
      description:
        "憑藉著7位創始工程師的熱情與毅力，走過風雨飄搖的草創時期，我們不僅堅持信念，努力執著鑽研，更洞悉市場需求，因而造就了今日的瑞昱，成為國際知名IC專業設計公司。"
    },
    {
      name: "立錡科技",
      key: "6",
      logoUrl:
        "https://richtek.referrals.selectminds.com/media/client_3_s2_r0_v1524817811639_main.png",
      link: "https://richtek.referrals.selectminds.com/jobs/search/27768",
      description:
        "國際級的電源管理IC設計公司。專注於提供客戶最多元且最具競爭力的電源管理IC產品以及完整的電源解決方案。"
    },
    {
      name: "高通",
      key: "7",
      logoUrl:
        "http://thearea.org/wp-content/uploads/2019/03/qc_logo_dml_rgb_blu_pos.png",
      link: "https://jobs.qualcomm.com/public/search.xhtml",
      description: "位於美國加州聖地牙哥的無線電通信技術研發公司。"
    },
    {
      name: "奇景光電",
      key: "8",
      logoUrl:
        "https://img.technews.tw/wp-content/uploads/2015/01/Hima-logo.jpg",
      link: "https://www.himax.com.tw/zh/company/careers/",
      description: "專注於影像顯示處理技術之IC設計公司。"
    },
    {
      name: "宏碁",
      key: "9",
      logoUrl:
        "https://c.share.photo.xuite.net/yuan6133/1cd27e2/7253464/279601162_m.jpg",
      link: "https://www.acer.com/ac/zh/TW/content/global-recruiting",
      description:
        "Acer 的產品範圍涵蓋筆記型電腦、桌上型電腦、平板電腦、智慧型手機、顯示器、投影機以及雲端解決方案，適合家庭使用者、企業、政府與教育機構使用。"
    },
    {
      name: "HTC",
      key: "10",
      logoUrl: "https://logodix.com/logo/32418.png",
      link: "https://www.htc.com/tw/working/join/",
      description:
        "HTC VIVE 開創了虛擬實境系統之先河。體驗全新虛擬世界，讓自己沉浸於視覺、身體和情感震撼之中。"
    },
    {
      name: "安霸",
      key: "11",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQadrq_UoG8Fqs4Wm1hDYR9itvq1c8yAfQz1pJ3SHKu9eOEmE4x&s",
      link:
        "https://chp.tbe.taleo.net/chp02/ats/careers/v2/jobSearch?org=AMBARELLA2015&cws=50",
      description:
        "安霸(Ambarella)，2004年1月於美國矽谷正式設立，為美商Benchmark及多位專業研發人員合資成立之公司，並迅速成為數位多媒體核心處理器之領導廠商。"
    },
    {
      name: "慧榮科技",
      key: "12",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Silicon_Motion_logo.svg/500px-Silicon_Motion_logo.svg.png",
      link: "http://cht.siliconmotion.com/hr/A7.0_HR.php",
      description:
        "慧榮科技是NAND Flash快閃記憶體控制晶片的全球領導者，擁有超過20年的設計開發經驗，為SSD及其他固態儲存裝置提供領先業界的高效能儲存解決方案，應用範圍包括智慧型手機、個人電腦、資料中心、商業及工控應用。。"
    },
    {
      name: "晶豪科技",
      key: "13",
      logoUrl:
        "https://www.krom.com.tw/UserFiles/goods/64/b/20150813182840_0.jpg",
      link: "https://www.esmt.com.tw/zh-tw",
      description:
        "晶豪科技股份有限公司為一專業 IC 設計公司，於 1998 年 6 月成立於台灣之新竹科學工業園區。本公司主要業務包含自有品牌之 IC 產品設計、製造、銷售及技術服務，並已於 2002 年 3 月在臺灣證券交易所掛牌上市，代號3006。。"
    }
  ]
};

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  },
  header: {
    fontSize: 20,
    fontWeight: 800
  },
  companyCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper
  },
  nameContainer: {
    display: "flex",
    marginLeft: 16,
    flexDirection: "column"
  },
  logo: {
    maxWidth: 100,
    height: 100,
    margin: 16,
    objectFit: "contain"
  },
  title: {
    fontSize: 24,
    textAlign: "left"
  },
  description: {
    marginTop: 16,
    fontSize: 18,
    textAlign: "left"
  }
}));

const CompanyCard: React.FC<Company> = props => {
  const classes = useStyles();
  return (
    <div
      className={classes.companyCardContainer}
      onClick={() => openInNewTab(checkUrl(props.link))}
    >
      <img src={props.logoUrl} className={classes.logo} />
      <div className={classes.nameContainer}>
        <div className={classes.title}>{props.name}</div>
        <div className={classes.description}>{props.description}</div>
      </div>
    </div>
  );
};

const JobSearch: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大電機</Button>
          </Link>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大資工</Button>
          </Link>
        </div>
        <div className={classes.header}>
          精選台大電機畢業生，最常去的公司。先從這些公司開始應徵吧!
        </div>
        {companies["ee"].map(c => (
          <CompanyCard key={c.key} {...c} />
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
