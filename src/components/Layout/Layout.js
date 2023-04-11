import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
// import {Box, IconButton, Link} from '@material-ui/core'
// import Icon from '@mdi/react'

// //icons
// import {
//   mdiFacebook as FacebookIcon,
//   mdiTwitter as TwitterIcon,
//   mdiGithub as GithubIcon,
// } from '@mdi/js'

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";


// context
import { useLayoutState } from "../../context/LayoutContext";
import CourseCategory from "../../pages/courseCategory/CourseCategory";
import Courses from "../../pages/courses/Courses";
import AddOrEditCourse from "../../pages/AddCourse/AddOrEditCourse";
import CourseContent from "../../pages/courseContent/CourseContent";
import ManageClassAndSubject from "../../pages/classAndSubjects/ManageClassAndSubject";
import Quizzes from "../../pages/quizzes/Quizzes";
import QuizQuestions from "../../pages/quizQuestions/QuizQuestions";
import FreeVideos from "../../pages/freeVideos/FreeVideos";
import ManageEbooks from "../../pages/manageEbooks/ManageEbooks";
import AppSlider from "../../pages/AppSlider/AppSlider";
import PushNotification from "../../pages/pushNotification/PushNotification";
import Users from "../../pages/users/Users";
import AllOrders from "../../pages/orders/AllOrders";


function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/typography" component={Typography} />
              <Route path="/app/tables" component={Tables} />
              <Route path="/app/notifications" component={Notifications} />

            
              <Route path="/app/courseCategory" component={CourseCategory}/>
              <Route path="/app/courses" component={Courses}/>
              <Route path="/app/newCourse" component={AddOrEditCourse}/>
              <Route path="/app/courseContent" component={CourseContent}/>
              <Route path="/app/manageClassAndSubject" component={ManageClassAndSubject}/>
              <Route path="/app/quizzes" component={Quizzes}/>
              <Route path="/app/questions/:qid/:title" component={QuizQuestions}/>
              <Route path="/app/freeVideos" component={FreeVideos}/>
              <Route path="/app/manageEbooks" component={ManageEbooks}/>
              <Route path="/app/appSlider" component={AppSlider}/>
              <Route path="/app/pushNotification" component={PushNotification}/>
              <Route path="/app/users" component={Users}/>
              <Route path="/app/orders" component={AllOrders}/>


            
              <Route
                exact
                path="/app/ui"
                render={() => <Redirect to="/app/ui/icons" />}
              />
              <Route path="/app/ui/maps" component={Maps} />
              <Route path="/app/ui/icons" component={Icons} />
              <Route path="/app/ui/charts" component={Charts} />
            </Switch>
          
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
