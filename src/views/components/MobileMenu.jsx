import React from "react";
import { useContext, useCallback, useEffect } from "react"
import { ModalContext } from "../../contexts/modalContext";
import HeaderMenu from "./HeaderMenu";


const MobileMenu = () => {
  const { setShowMobileMenu } = useContext(ModalContext);


  const clickedFormWrapperHandler = useCallback(
    (event) => {
      if (event.target !== document.getElementById("mobile-menu")) {
        if (event.target.closest("#mobile-menu") !== document.getElementById("mobile-menu")) {
          if (event.target.closest("#mobile-menu-btn") !== document.getElementById("mobile-menu-btn")) {
            setShowMobileMenu(false);
            window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
          }
        }
      }
    }
    , [])

  useEffect(() => {
    window.addEventListener("mousedown", clickedFormWrapperHandler, true);
    return () => { window.removeEventListener("mousedown", clickedFormWrapperHandler, true); };
  }, []);


  return (
    <aside id="mobile-menu">
      <nav>
        <HeaderMenu />
      </nav>
    </aside>
  );
}


export default MobileMenu;