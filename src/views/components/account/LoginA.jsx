import React from "react";
import { useState, useCallback, useEffect, useContext } from "react"
import { ModalContext } from "../../../contexts/modalContext";
import "../../../public/styles/account/Authentication.css";
import { signInAuthUserWithEmailAndPassword } from "../../../utils/firebase/firebase"


const defaultFormFields = {
    emailLogin: "",
    passwordLogin: ""
}


function LoginA(props) {
    //const { setCurrentUser } = useContext(UserContext);

    const { setShowModals } = useContext(ModalContext);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { emailLogin, passwordLogin } = formFields;

    const clickedFormWrapperHandler = useCallback(
        (event) => {
            if (event.target !== document.getElementsByClassName("formWrapper")[0]) {
                if (event.target.closest(".formWrapper") !== document.getElementsByClassName("formWrapper")[0]) {
                    setShowModals({
                        showLogin: false,
                        showSignUp: false,
                        showDisplayNameRegister: false
                    });

                    window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
                }
            }
        }
        , [])

    useEffect(() => {
        window.addEventListener("mousedown", clickedFormWrapperHandler, true);
        return () => { window.removeEventListener("mousedown", clickedFormWrapperHandler, true); };
    }, []);


    const handleChange = (event) => {
        setFormFields({ ...formFields, [event.target.id]: event.target.value })
    };

    const handleClickSignUp = () => {
        window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
        setShowModals({
            showLogin: false,
            showSignUp: true,
            showDisplayNameRegister: false
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            event.target[3].disabled = true;

            const { user } = await signInAuthUserWithEmailAndPassword(emailLogin, passwordLogin);
            //setCurrentUser(user);

            event.target[3].disabled = false;

        } catch (error) {
            if (error.code === "auth/wrong-password") {
                alert('Incorrect password or email.');
            }
            else if (error.code === "auth/user-not-found") {
                alert('Incorrect password or email.');
            }
            else { alert(error); }

            event.target[3].disabled = false;
            return;
        }

        window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
        setShowModals({
            showLogin: false,
            showSignUp: false,
            showDisplayNameRegister: false
        });

    };


    /*const logInWithFirebase = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }*/


    return (
        <>
            <aside className="authenticationAside">
                <div className="formWrapper">

                    <h2>Log in</h2>

                    <form onSubmit={handleSubmit}>

                        <input type="hidden" name="_csrf" value="4hgh56fdgs89751g35498df75" />
                        <p>
                            <label htmlFor="emailLogin">E-Mail:</label>
                            <input type="email" name="email" id="emailLogin" onChange={handleChange} value={emailLogin} autoComplete="email" placeholder="email@mail.com" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="80" required />
                        </p>
                        <p>
                            <label htmlFor="passwordLogin">Password:</label>
                            <input type="password" id="passwordLogin" onChange={handleChange} value={passwordLogin} autoComplete="current-password" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="80" required />
                        </p>

                        <button className="btn" type="submit">Log in</button>

                        <p className="formParagraph">Don't have an account? <span onClick={handleClickSignUp}>Sign up</span></p>

                    </form>

                </div>
            </aside>
        </>
    );
}


export default LoginA;