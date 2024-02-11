import React from 'react';
import { useEffect, useContext, useCallback } from "react"
import { ArticlesContext } from "../../../../contexts/articlesContext";
import "../../../../public/styles/forum/forumMain/ForumMain.css";

import ArticlePosting from "./ArticlePosting"
import PostedArticles from "./PostedArticles"
import User from "../../../../models/user.model.js";


function ForumMain() {
    const { articles, setArticles, articlesLimit, setArticlesLimit, articleQueryCursor, setArticleQueryCursor } = useContext(ArticlesContext);
    //const author = new User("username");
    //author.profilePic = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRgUOj9GQiY5ck4eQoW4HNJplMRNbN0N5jpw&usqp=CAU";


    const scrollHandler = useCallback(
        () => {
            //const distanceToBottom = document.body.getBoundingClientRect().bottom;

            //if (distanceToBottom < document.documentElement.clientHeight + 150 ) {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                setArticlesLimit((prevConfig) => ({ counter: prevConfig.counter + 1, next: false, previous: false }));
                setArticleQueryCursor((prevConfig) => ({ ...prevConfig, limit: prevConfig.limit + 4, start: null }));
            }
            //setTimeout(() => {}, 5000);
        }
        , [])

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => { window.removeEventListener("scroll", scrollHandler) };
    }, []);


    return (
        <>
            <main>

                <ArticlePosting />

                {Object.keys(articles).map((articleId) => (
                    <PostedArticles key={articleId}
                        articleId={articleId}
                        user={{
                            userId: articles[articleId].userId,
                            username: articles[articleId].username, sameNameCounter: articles[articleId].sameNameCounter
                        }}
                        timestamp={articles[articleId].timestamp}
                        message={articles[articleId].message}
                        likesNameArray={articles[articleId].likesNameArray}
                        recommendsNameArray={articles[articleId].recommendsNameArray}
                    />
                ))}


            </main>
        </>
    );
}

export default ForumMain;