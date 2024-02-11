import React from "react";
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../../contexts/userContext";
import { ModalContext } from "../../../../contexts/modalContext";
import { ArticlesContext } from "../../../../contexts/articlesContext";
import "../../../../public/styles/forum/forumMain/PostedArticles.css";
import { deleteField } from 'firebase/firestore'
import { addArrayToDb, deleteArrayFromDb, getDbData, updateDbValue } from "../../../../utils/firebase/firebase";
import User from "../../../../models/user.model.js";


import { Avatar } from "@mui/material";
import ThumbUpOffAltRoundedIcon from '@mui/icons-material/ThumbUpOffAltRounded';
/*import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded';*/
import ArticleIcon from '@mui/icons-material/Article';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';


function doesImageExist(url) {
    return new Promise((resolve) => {
        const img = new Image();

        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}


function PostedArticles({ articleId, user, timestamp, message,
    likesNameArray, recommendsNameArray }) {

    const { showModals, setShowModals } = useContext(ModalContext);
    const { currentUser } = useContext(UserContext);
    const { articles, setArticles, articlesLimit, setArticlesLimit, articleQueryCursor, setArticleQueryCursor } = useContext(ArticlesContext);

    const [profilePic, setProfilePic] = useState();
    const [messageTiles, setMessageTiles] = useState([]);


    useEffect(() => {
        async function updateUserData() {
            try {
                const docUser = await getDbData("users", user.userId);

                if (user.username !== docUser.username || user.sameNameCounter !== docUser.sameNameCounter) {
                    setArticles({ ...articles, [articleId]: { username: docUser.username, sameNameCounter: docUser.sameNameCounter } });
                    updateDbValue("articlesMain", articleId,
                        {
                            "username": docUser.username,
                            "sameNameCounter": docUser.sameNameCounter ? docUser.sameNameCounter : deleteField()
                        }); //todo: articlesMain
                    console.log("updated");
                }

                setProfilePic(docUser.profilePic);



                const textAndURLs = [];
                const linkRegex = /(https?\:\/\/)?(www\.)?[^\s]+\.[^\s]+/g
                //const imageUrlRegex = /\.(jpeg|jpg|gif|png|webp)$/i;
                let match;

                while ((match = linkRegex.exec(message)) !== null) {
                    textAndURLs.push({
                        textType: 1,
                        text: match.input.substring(textAndURLs[textAndURLs.length - 1]?.end, match.index),
                        start: textAndURLs[textAndURLs.length - 1]?.end,
                        end: match.index,
                        pos: textAndURLs.length
                    });

                    /*if (imageUrlRegex.test(match[0])) {
                        textAndURLs.push({ textType: 2, text: match[0], start: match.index, end: linkRegex.lastIndex, pos: textAndURLs.length });
                    }*/
                    //const response=await fetch(match[0],{mode: 'no-cors'})
                    

                    const ImageExistResponse = await doesImageExist(match[0])

                    if (ImageExistResponse) {
                        textAndURLs.push({ textType: 2, text: match[0], start: match.index, end: linkRegex.lastIndex, pos: textAndURLs.length });
                    }
                    else {
                        textAndURLs.push({ textType: 0, text: match[0], start: match.index, end: linkRegex.lastIndex, pos: textAndURLs.length });
                    }
                }

                textAndURLs.push({
                    textType: 1,
                    text: message.substring(textAndURLs[textAndURLs.length - 1]?.end),
                    start: textAndURLs[textAndURLs.length - 1]?.end,
                    end: message.length,
                    pos: textAndURLs.length
                });

                setMessageTiles(textAndURLs);
            }
            catch {
                //items.username = "Anonymous"
            }
        }

        updateUserData();
    }, []);


    const handleClickLike = () => {
        if (!currentUser) {
            setShowModals({
                showLogin: false,
                showSignUp: true,
                showDisplayNameRegister: false
            });

            return;
        }
        console.log(currentUser);

        setArticlesLimit({ counter: articlesLimit.counter + 1, next: false, previous: false })
        setArticleQueryCursor({ limit: articleQueryCursor.limit + 1, start: null, end: articleQueryCursor.end })


        if (!likesNameArray?.some((item) => {
            if (item.userId === currentUser.uid) {
                deleteArrayFromDb("articlesMain", articleId, "likesNameArray", {
                    username: item.username,
                    userId: item.userId
                });
                return true;
            }

            return false;
        })) {
            addArrayToDb("articlesMain", articleId, "likesNameArray", {
                username: currentUser.username,
                userId: currentUser.uid
            });

        }
    }

    const handleClickRecommend = () => {
        if (!currentUser) {
            setShowModals({
                showLogin: false,
                showSignUp: true,
                showDisplayNameRegister: false
            });

            return;
        }

        if (!recommendsNameArray?.some((item) => {
            if (item.userId === currentUser.uid) {
                deleteArrayFromDb("articlesMain", articleId, "recommendsNameArray", {
                    username: item.username,
                    userId: item.userId
                });
                return true;
            }

            return false;
        })) {
            addArrayToDb("articlesMain", articleId, "recommendsNameArray", {
                username: currentUser.username,
                userId: currentUser.uid
            });

        }
    }


    //console.log(articles[articleId]?.likesNameArray?.length);
    return (
        <>
            <article className="forumMainTiles">

                <section className="topForumMainTiles">

                    <Avatar src={profilePic} />
                    <div className="topInfoForumMainTiles">
                        <h3>{user.username + (user.sameNameCounter ? ' #' + (user.sameNameCounter + 1) : '')}</h3>
                        <p>{(new Date(timestamp?.toDate()).toUTCString())}</p>
                    </div>

                </section>

                <section className="bottomForumMainTiles">
                    {messageTiles.length == 0 ? (<p>{message}</p>) : (
                        <p>
                            {messageTiles.map((messageTile) => {
                                if (messageTile.textType == 1) {
                                    return <span key={articleId + messageTile.pos}>{messageTile.text}</span>;
                                }
                                else if (!messageTile.textType) {
                                    return (
                                        <span key={articleId + messageTile.pos}>
                                            <a href={messageTile.text} target="_blank">{messageTile.text}</a>
                                        </span>
                                    );
                                }
                                else if (messageTile.textType == 2) {
                                    return (
                                        <span key={articleId + messageTile.pos}>
                                            <a href={messageTile.text} target="_blank">{messageTile.text}</a>
                                            <span className="postedImages">
                                                <a href={messageTile.text} target="_blank">
                                                    <img src={messageTile.text} alt={`Posted Image/Link: ${messageTile.text}`} />
                                                </a>
                                            </span>
                                        </span>
                                    );
                                }
                            })}
                        </p>
                    )}
                </section>

                <section className="ratingIconsForumMainTiles">
                    <div className="nmbrRatingIconsForumMainTiles">
                        {likesNameArray?.length > 0 &&
                            <div className="ratingIconForumMainTiles">
                                <ThumbUpOffAltRoundedIcon className="recommendsRatingIconForumMainTiles" fontSize="inherit" />
                                <p>{likesNameArray?.length}</p>
                            </div>}

                        {recommendsNameArray?.length > 0 &&
                            <div className="ratingIconForumMainTiles">
                                <ArticleIcon className="recommendsRatingIconForumMainTiles" fontSize="inherit" />
                                <p>{recommendsNameArray?.length}</p>
                            </div>}
                    </div>

                    <div className="sendRatingIconsForumMainTiles">
                        <div onClick={handleClickLike} className="ratingIconForumMainTiles">
                            {!currentUser || !(likesNameArray?.some(item => item.userId === currentUser?.uid)) ?
                                <ThumbUpOutlinedIcon fontSize="inherit" /> :
                                <ThumbUpAltIcon fontSize="inherit" />}
                            <p>Like</p>
                        </div>
                        <div onClick={handleClickRecommend} className="ratingIconForumMainTiles">
                            {!currentUser || !(recommendsNameArray?.some(item => item.userId === currentUser?.uid)) ?
                                <ArticleOutlinedIcon fontSize="inherit" /> :
                                <ArticleIcon fontSize="inherit" />}
                            <p>Recommend reading</p>
                        </div>
                    </div>

                </section>

            </article>
        </>
    );
}

export default PostedArticles;