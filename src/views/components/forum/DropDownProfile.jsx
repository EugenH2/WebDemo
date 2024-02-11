import React from "react";
import { useEffect, useCallback } from "react"
import "../../../public/styles/forum/DropDownProfile.css";

import { signOutUser } from "../../../utils/firebase/firebase"


const DropDownProfile = (props) => {
  //const { setCurrentUser } = useContext(UserContext);

  const clickedFormWrapperHandler = useCallback(
    (event) => {
      //if (event.target.closest("#signUpButton") !== document.getElementById("signUpButton")) {
      if (event.target !== document.getElementById("dropdownProfile")) {
        if (event.target.closest(".dropdown-content") !== document.getElementById("dropdownProfile")) {
          if (event.target.closest("#profilButtonForumSidebar") !== document.getElementById("profilButtonForumSidebar")) {
            props.setShowMenus.setShowMenus(
              { ...props.setShowMenus.showMenus.showDropDownProfile, showDropDownProfile: false });
            window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
          }
        }
        // }
      }
    }
    , [])

  useEffect(() => {
    window.addEventListener("mousedown", clickedFormWrapperHandler, true);
    return () => { window.removeEventListener("mousedown", clickedFormWrapperHandler, true); };
  }, []);



  const signOutHandler = async () => {
    await signOutUser();
    //setCurrentUser(null);
    props.setShowMenus.setShowMenus(
      { ...props.setShowMenus.showMenus.showDropDownProfile, showDropDownProfile: false })
  }

  return (
    <section id="dropdownProfile" className="dropdown-content">
      <div className="forumSidebarIcons forumSidebarIcons--active">
        <h4>Settings</h4>
      </div>
      <div onClick={signOutHandler} className="forumSidebarIcons forumSidebarIcons--active">
        <h4>Logout</h4>
      </div>
    </section>

  )
}


export default DropDownProfile;