import React from "react";
import "../../../public/styles/forum/ForumSidebar.css";
import { useContext } from "react"
import { UserContext } from "../../../contexts/userContext";
import { ModalContext } from "../../../contexts/modalContext";
import User from "../../../models/user.model.js";

import DropDownProfile from "./DropDownProfile"

import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
//import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; //Profil
import { Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


//<div className="forumSidebar">
function ForumSidebar(props) {
  const { showModals, setShowModals } = useContext(ModalContext);
  const { currentUser } = useContext(UserContext);
  const user = null//new User("username");

  function handleClickSignUp() {
    setShowModals({
      showLogin: false,
      showSignUp: true,
      showDisplayNameRegister: false
    });
  }

  function handleClickLogIn() {
    setShowModals({
      showLogin: true,
      showSignUp: false,
      showDisplayNameRegister: false
    });

  }

  function handleClickProfile() {
    if (!props.setShowMenus.showMenus.showDropDownProfile) {
      props.setShowMenus.setShowMenus(
        { ...props.setShowMenus.showMenus.showDropDownProfile, showDropDownProfile: true })
    }
    else {
      props.setShowMenus.setShowMenus(
        { ...props.setShowMenus.showMenus.showDropDownProfile, showDropDownProfile: false })
    }
  }

  return (
    <>
      <aside id="forumSidebarAside">
        <nav>
          <div className="forumSidebarIcons" id="forumSidebarSearchDiv">
            <SearchIcon />
            <input
              id="forumSidebarSearchInput"
              type="search"
              placeholder="Search"
            />
          </div>

          <div className="forumSidebarIcons forumSidebarIcons--active">
            <HomeOutlinedIcon fontSize="large" />
            <h4>link</h4>
          </div>

          <div className="forumSidebarIcons forumSidebarIcons--active">
            <AutoStoriesOutlinedIcon fontSize="large" />
            <h4>link</h4>
          </div>

          {!currentUser ? (
            <div onClick={handleClickSignUp} className="forumSidebarIcons forumSidebarIcons--active">
              <Avatar sx={{ bgcolor: "#bdbdbd" }} />
              <h4>Sign&nbsp;in</h4>
            </div>
          ) : (
            <>
              <div onClick={handleClickProfile} id="profilButtonForumSidebar" className="forumSidebarIcons forumSidebarIcons--active" >
                <Avatar sx={{ bgcolor: "#bdbdbd" }} src={currentUser.profilePic}/>
                <h4>Profil</h4>
              </div>
              {props.setShowMenus.showMenus.showDropDownProfile && <DropDownProfile setShowMenus={props.setShowMenus} />}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
/*
<IconButton>
                        <AddIcon />
                    </IconButton>
                    <IconButton>
                        <ForumIcon />
                    </IconButton>
                    <IconButton>
                        <NotificationsActiveIcon />
                    </IconButton>
                    <IconButton>
                        <ExpandMoreIcon />
                    </IconButton>
*/

export default ForumSidebar;
