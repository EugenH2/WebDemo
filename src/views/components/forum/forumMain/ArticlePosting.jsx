import React from "react";
import { useContext, useState } from "react"
import { UserContext } from "../../../../contexts/userContext";
import { ModalContext } from "../../../../contexts/modalContext";
import "../../../../public/styles/forum/forumMain/ArticlePosting.css";

import { serverTimestamp } from "firebase/firestore";
import { addCollectionAndDocuments } from "../../../../utils/firebase/firebase"
import { Avatar, Button } from "@mui/material";


function ArticlePosting() {
    const { setShowModals } = useContext(ModalContext);
    const { currentUser } = useContext(UserContext);
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) {
            setShowModals({
                showLogin: false,
                showSignUp: true,
                showDisplayNameRegister: false
            });
            return;
        }


        addCollectionAndDocuments("articlesMain", {
            username: currentUser.username,
            userId: currentUser.uid,
            message: input,
            timestamp: serverTimestamp()
        });

        setInput("");
    };

    return (
        <>
            <section className="forumMainTiles articlePostingDiv">

                <Avatar />
                <form>

                    <input placeholder="Create a new article" id="createArticleInput" value={input}
                        onChange={(e) => setInput(e.target.value)} autoComplete="on" />
                    <Button onClick={handleSubmit} type="submit">Submit</Button>

                </form>

            </section>
        </>
    );
}

export default ArticlePosting;