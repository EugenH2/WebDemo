import React from "react";
import { useContext } from "react"
import { ModalContext } from "../../contexts/modalContext";
import "../../public/styles/Header.css";
import HeaderMenu from "./HeaderMenu";
import MobileMenu from "./MobileMenu";

//<div className='header'>
function Header() {
    const { showMobileMenu, setShowMobileMenu } = useContext(ModalContext);


    function handleClickMobileBtn() {
        setShowMobileMenu(!showMobileMenu);
    }


    return (
        <>

            <header id="main-header">
                <div>

                    <div id="nav-roof"><h1>For demonstration purposes only, no use allowed</h1></div>

                    <div className="nav-base">
                        <div className="nav-union">
                            <button onClick={handleClickMobileBtn} id="mobile-menu-btn">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <nav>
                                <HeaderMenu />
                            </nav>
                        </div>
                        <div id="div-logo-name"><a id="logo-name" href="/">ForumDemo</a></div>
                    </div>

                </div>
            </header>

            {showMobileMenu && <MobileMenu />}

        </>
    );
}

export default Header;