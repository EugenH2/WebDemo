import { ArticlesProvider } from "../../../contexts/articlesContext";
import ForumIndex from "../../../views/components/forum/ForumIndex";



function Forum() {

    return (
        <ArticlesProvider>
            <ForumIndex />
        </ArticlesProvider>
    );
}

export default Forum;