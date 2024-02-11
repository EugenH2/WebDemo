import "./App.css";
import "./public/styles/Base.css";
import { UserProvider } from "./contexts/userContext";
import { ArticlesProvider } from "./contexts/articlesContext";
import { ModalProvider } from "./contexts/modalContext";
import Header from "./views/components/Header";
import Forum from "./views/routes/forum/Forum.page";
import ForumIndex from "./views/components/forum/ForumIndex";
import { Routes, Route } from "react-router-dom"



function App() {

  /*const user = null;*/


  return (
    <div className="app">

      <ModalProvider>
        <UserProvider>
          <Header />

          <Routes>
            <Route path="/" element={<Forum />} />
            <Route path="/forum" element={<Forum />} />
          </Routes>

        </UserProvider>
      </ModalProvider>

    </div>
  );
}

export default App;
