import React from "react";
import "../../../public/styles/forum/ContactsSidebar.css";

import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
//import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; //Profil
import { Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ForumIcon from  "@mui/icons-material/Forum";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from  "@mui/icons-material/ExpandMore";

//<div className="forumSidebar">
function ContactsSidebar() {
    return (
        <>
            <aside id="contactsSidebarAside">
                <nav >
                    <div className="forumSidebarIcons forumSidebarIcons--active">
                        <h3>Join Discord</h3>
                    </div>

                    <div className="forumSidebarIcons forumSidebarIcons--active">
                        <Avatar/><h4></h4>
                    </div>
                    <div className="forumSidebarIcons forumSidebarIcons--active">
                        <Avatar/><h4></h4>
                    </div>
                    <div className="forumSidebarIcons forumSidebarIcons--active">
                        <Avatar/><h4></h4>
                    </div>

                    
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
                    


export default ContactsSidebar;