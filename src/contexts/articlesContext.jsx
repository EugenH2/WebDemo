import { createContext, useState, useEffect } from "react"
import { getUpdatedArticles, } from "../utils/firebase/firebase"


export const ArticlesContext = createContext({
    articles: {},
    setArticles: () => null,
    articlesLimit: {},
    setArticlesLimit: () => null,
    articleQueryCursor: {},
    setArticleQueryCursor: () => null,
});



export const ArticlesProvider = ({ children }) => {
    const [articles, setArticles] = useState({});
    const [articlesLimit, setArticlesLimit] = useState({ counter: 0, next: false, previous: false });
    const [articleQueryCursor, setArticleQueryCursor] = useState({ limit: 4, start: null, end: null });
    const value = { articles, setArticles, articlesLimit, setArticlesLimit, articleQueryCursor, setArticleQueryCursor };


    useEffect(() => {

        const unsubscribe = getUpdatedArticles("articlesMain", articlesLimit, articleQueryCursor, (collection) => {
            const collectionMap = collection.docs.reduce((acc, docSnapshot) => {
                const key = docSnapshot.id;
                const items = docSnapshot.data();

                acc[key] = items;
                return acc;
            }, {})


            setArticleQueryCursor({ limit: articleQueryCursor.limit, start: collection.docs[0], end: collection.docs[collection.docs.length - 1] });
            setArticles(collectionMap);

        })

        return unsubscribe;


    }, [articlesLimit]);


    return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};

