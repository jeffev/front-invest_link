import Favorita from "./Favoritas";
import ListaAcoes from "./ListaAcoes";
import MinhaCarteira from "./MinhaCarteira";
import Sentimento from "./Sentimento";
import Top10 from "./Top10";
import MinhasOpcoes from "./MinhasOpcoes";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";

function Conteudo() {
    return (
        <Routes>
            <Route exact path="/" Component={Home} />
            <Route path="/home" Component={Home} />
            <Route path="/login" Component={Login} />
            <Route path="/listaAcoes" Component={ListaAcoes} />
            <Route path="/top10" Component={Top10} />
            <Route path="/sentimento" Component={Sentimento} />
            <Route path="/favoritas" Component={Favorita} />
            <Route path="/minhaCarteira" Component={MinhaCarteira} />
            <Route path="/minhasOpcoes" Component={MinhasOpcoes} />
        </Routes>
    );
}

export default Conteudo;