import React from "react";
import { useState, useCallback, useEffect, useContext } from "react"
import { UserContext } from "../../../contexts/userContext";
import { ModalContext } from "../../../contexts/modalContext";
import "../../../public/styles/account/Authentication.css";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../../utils/firebase/firebase"



const defaultFormFields = {
    emailSignup: "",
    confirmEmailSignup: "",
    passwordSignup: ""
}


const Signup = (props) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { setShowModals } = useContext(ModalContext);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { emailSignup, confirmEmailSignup, passwordSignup } = formFields;

    const clickedFormWrapperHandler = useCallback(
        (event) => {
            //if (event.target.closest("#signUpButton") !== document.getElementById("signUpButton")) {
            if (event.target !== document.getElementsByClassName("formWrapper")[0]) {
                if (event.target.closest(".formWrapper") !== document.getElementsByClassName("formWrapper")[0]) {
                    setShowModals({
                        showLogin: false,
                        showSignUp: false,
                        showDisplayNameRegister: false
                    });

                    window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
                }
                // }
            }
        }
        , [])

    useEffect(() => {
        document.getElementById("buttonCreateAcount").disabled = false;
        window.addEventListener("mousedown", clickedFormWrapperHandler, true);
        return () => { window.removeEventListener("mousedown", clickedFormWrapperHandler, true); };
    }, []);

    const handleClickLogIn = () => {
        window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
        setShowModals({
            showLogin: true,
            showSignUp: false,
            showDisplayNameRegister: false
        });

    };


    const handleChange = (event) => {
        setFormFields({ ...formFields, [event.target.id]: event.target.value })
    };

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (emailSignup !== confirmEmailSignup) {
            alert("The email confirmation does not match.");
            return;
        }

        try {
            document.getElementById("buttonCreateAcount").disabled = true;

            const { user } = await createAuthUserWithEmailAndPassword(emailSignup, passwordSignup);
            //setCurrentUser(user);
            await createUserDocumentFromAuth(user);

            //setCurrentUser({ ...currentUser, username: "Anonymous" });
            resetFormFields();
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert('Email already in use. Log in instead, by pressing the "Log in" button.')
            }
            else { alert("Something went wrong. Registration Error: 801"); }

            document.getElementById("buttonCreateAcount").disabled = false;
            return;
        }

        window.removeEventListener("mousedown", clickedFormWrapperHandler, true);
        setShowModals({
            showLogin: false,
            showSignUp: false,
            showDisplayNameRegister: true
        });

    };

    /*const signInWithFirebase = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }*/


    return (
        <>
            <aside className="authenticationAside">
                <div className="formWrapper">

                    <h2>Create New Account</h2>

                    <form onSubmit={handleSubmit}>

                        <input type="hidden" name="_csrf" value="4hgh56fdgs89751g35498df75" />
                        <p>
                            <label htmlFor="emailSignup">E-Mail:</label>
                            <input type="email" name="email" id="emailSignup" onChange={handleChange} value={emailSignup} placeholder="email@mail.com" autoComplete="email" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="80" required />
                        </p>
                        <p>
                            <label htmlFor="confirmEmailSignup">Confirm E-Mail:</label>
                            <input type="email" name="email" id="confirmEmailSignup" onChange={handleChange} value={confirmEmailSignup} placeholder="email@mail.com" autoComplete="email" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="80" required />
                        </p>
                        <p>
                            <label htmlFor="passwordSignup">Password:</label>
                            <input type="password" id="passwordSignup" onChange={handleChange} value={passwordSignup} minLength="5" autoComplete="new-password" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="80" required />
                        </p>

                        <button className="btn" id="buttonCreateAcount" type="submit">Create Account</button>

                        <p className="formParagraph">Already have an account? <span onClick={handleClickLogIn}>Log in</span></p>

                    </form>

                </div>
            </aside>
        </>
    );
}


export default Signup;









