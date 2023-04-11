import { Drawer, IconButton, List } from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon, BookmarkBorder, FilterNone as UIElementsIcon, FormatSize as TypographyIcon, HelpOutline as FAQIcon, Home as HomeIcon, Image, LaptopChromebook, LibraryBooks as LibraryIcon, LibraryBooksTwoTone, Notifications, NotificationsNone as NotificationsIcon, OndemandVideoOutlined, QuestionAnswer as SupportIcon, School, VerifiedUser
} from "@material-ui/icons";

import { useTheme } from "@material-ui/styles";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// components
import Dot from "./components/Dot";
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  toggleSidebar, useLayoutDispatch, useLayoutState
} from "../../context/LayoutContext";
import { Person, PictureAsPdf, QuizOutlined, Sell } from "@mui/icons-material";

const structure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },

  { id: 1, type: "divider" },
  { id: 2, type: "title", label: "MANAGE" },
  {
    id:3,
    label:"Image Slider",
    link:"/app/appSlider",
    icon:<Image/>
  },
  {
    id:17,
    label:"Class & Subjects",
    link:"/app/manageClassAndSubject",
    icon:<School/>
  },
  {
    id:4,
    label:"Quizzes",
    link:"/app/quizzes",
    icon:<QuizOutlined/>
  },


  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "COURSE" },
  {
    id:7,
    label:"Course Category",
    link:"/app/courseCategory",
    icon:<BookmarkBorder/>
  },
  {
    id:8,
    label:"Courses",
    link:"/app/courses",
    icon:<LaptopChromebook/>
  },
  { id: 9, type: "divider" },
  { id: 10, type: "title", label: "EBOOK/NOTES" },
  {
    id:11,
    label:"Ebooks/PDFs",
    link:"/app/manageEbooks",
    icon:<PictureAsPdf/>
  },
  { id: 12, type: "divider" },
  { id: 13, type: "title", label: "FREE CONTENT" },
  {
    id:14,
    label:"Free Videos",
    link:"/app/freeVideos",
    icon:<OndemandVideoOutlined/>
  },

  { id: 15, type: "title", label: "USERS" },
  {
    id:16,
    label:"Users",
    link:"/app/users",
    icon:<Person/>
  },
  { id: 15, type: "title", label: "ORDERS" },
  {
    id:16,
    label:"Orders",
    link:"/app/orders",
    icon:<Sell/>
  }
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
