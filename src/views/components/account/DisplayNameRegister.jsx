import React from "react";
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../contexts/userContext";
import { ModalContext } from "../../../contexts/modalContext";
import "../../../public/styles/account/Authentication.css";
import { updateDbValue, nmbrOfSameNameInDb, changeNameInDbAtomic, getDbData } from "../../../utils/firebase/firebase"
import { setUserData } from "../../../models/user.model";

import { Avatar } from "@mui/material";


const defaultFormFields = {
    username: ""
}

const defaultPreview = {
    usernamePreview: "",
    sameNameCounter: 0
}


const DisplayNameRegister = (props) => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [preview, setPreview] = useState(defaultPreview);
    const { setShowModals } = useContext(ModalContext);
    const { currentUser, setCurrentUser } = useContext(UserContext);


    useEffect(() => {
        const asyncSetUserData = async () => {
            if (currentUser) {
                await setUserData(currentUser, setCurrentUser);
            }
        }

        asyncSetUserData();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            event.target[1].disabled = true;

            const username = formFields.username // event.target["username"].value;

            if (username.toLowerCase() === currentUser.username.toLowerCase()) {
                if (username !== (await getDbData("users", currentUser.uid)).username) {
                    updateDbValue("users", currentUser.uid, { username: username })
                    await setUserData(currentUser, setCurrentUser);
                }
                else if (username.toLowerCase() === "anonymous") {

                }
                else { alert("Same name."); event.target[1].disabled = false; return; }

                setShowModals({
                    showLogin: false,
                    showSignUp: false,
                    showDisplayNameRegister: false
                });
                event.target[1].disabled = false; return;
            }

            await changeNameInDbAtomic(username, "users", currentUser.uid)
            await setUserData(currentUser, setCurrentUser);


            event.target[1].disabled = false;
            //await updateDbValue("users", currentUser.uid, "username", username);//todo: atomic
        } catch (error) {
            alert("Something went wrong. Name registration Error: 804");
            event.target[1].disabled = false;
            return;
        }


        setShowModals({
            showLogin: false,
            showSignUp: false,
            showDisplayNameRegister: false
        });
    };

    const handleSkip = async (event) => {
        setShowModals({
            showLogin: false,
            showSignUp: false,
            showDisplayNameRegister: false
        });

        await changeNameInDbAtomic("Anonymous", "users", currentUser.uid)
        await setUserData(currentUser, setCurrentUser);
    }

    const handleChange = (event) => {
        const username = event.target.value.replace(/#/g, '');

        nmbrOfSameNameInDb("users", username.toLowerCase()).then((nmbrOfSameName) => {
            let maxNameCounter = 0
            if (nmbrOfSameName.length > 0 && username.toLowerCase() != "anonymous") {
                maxNameCounter = nmbrOfSameName.reduce((prev, current) => {
                    return ((prev.sameNameCounter ?? 0) > (current.sameNameCounter ?? 0)) ? (prev ?? 0) : (current ?? 0);
                }, 0)

                maxNameCounter = (maxNameCounter.sameNameCounter ?? 0) + 1;
            }
            setPreview({ ...preview, usernamePreview: username, sameNameCounter: maxNameCounter })
        });

        setFormFields({ ...formFields, username: username })
    };

    return (
        <aside className="authenticationAside">
            <div className="formWrapper">

                <h2>This is the name by which <br /> you will be known here.</h2>

                <form onSubmit={handleSubmit}>

                    <p>
                        <label htmlFor="displayName">Username:</label>
                        <input type="text" name="username" id="displayName" onChange={handleChange} value={formFields.username} autoComplete="username" autoCapitalize="off" autoCorrect="off" spellCheck="false" maxLength="40" required />
                    </p>

                    <p className="formParagraph">It can be everything. Or be anonymous and <span onClick={handleSkip}>skip</span>.</p>

                    {formFields.username.length > 0 &&
                        <>
                            <p className="formParagraph">Preview:</p>
                            <article id="userNamePreview" className="forumMainTiles">

                                <section className="topForumMainTiles">

                                    <Avatar />
                                    <div className="topInfoForumMainTiles">
                                        <h3>{preview.usernamePreview + (preview.sameNameCounter ? ' #' + (preview.sameNameCounter + 1) : '')}</h3>
                                        <p>{(new Date()).toUTCString()}</p>
                                    </div>

                                </section>

                                <section className="bottomForumMainTiles">
                                    <p>....</p>
                                </section>
                            </article>
                        </>}

                    <button className="btn" type="submit">Create</button>

                </form>

            </div>
        </aside>
    );
}


export default DisplayNameRegister;









