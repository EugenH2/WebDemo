import { createContext, useState } from "react"

const defaultShowModals = {
    showLogin: false,
    showSignUp: false,
    showDisplayNameRegister: false
}


export const ModalContext = createContext({
    showModals: {},
    showMobileMenu: false,
    setShowModals: () => null,
    setShowMobileMenu: () => null
});

export const ModalProvider = ({ children }) => {
    const [showModals, setShowModals] = useState(defaultShowModals);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const value = { showModals, setShowModals, showMobileMenu, setShowMobileMenu };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};