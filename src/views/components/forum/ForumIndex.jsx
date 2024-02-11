import React from 'react';
import { useState, useContext } from "react"
import { ModalContext } from "../../../contexts/modalContext";
import "../../../public/styles/forum/ForumIndex.css";

import ForumSidebar from "./ForumSidebar"
import ForumMain from "./forumMain/ForumMain"
import ContactsSidebar from "./ContactsSidebar"
import LoginA from "../account/LoginA";
import Signup from "../account/Signup";
import DisplayNameRegister from "../account/DisplayNameRegister";



const defaultShowMenus = {
    showDropDownProfile: false
}

function ForumIndex() {
    const { showModals } = useContext(ModalContext);
    const [showMenus, setShowMenus] = useState(defaultShowMenus);

    return (
        <>
            <div id="forum">

                <ForumSidebar setShowMenus={{ showMenus, setShowMenus }} />
                <ForumMain />
                <ContactsSidebar />


                {showModals.showSignUp && <Signup />}
                {showModals.showLogin && <LoginA />}
                {showModals.showDisplayNameRegister && <DisplayNameRegister />}



            </div>
        </>
    );
}

export default ForumIndex;