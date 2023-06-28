import Favorita from "./Favoritas";
import ListaAcoes from "./ListaAcoes";
import MinhaCarteira from "./MinhaCarteira";
import Sentimento from "./Sentimento";
import Top10 from "./Top10";
import MinhasOpcoes from "./MinhasOpcoes";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import {Outlet, Navigate} from 'react-router-dom';
import authService from "../services/auth.service";
import Login from "./Login.js";

export const PrivateRoute = () => {
    const isAuthenticated = authService.getAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function Rotas() {
    return (
        <Routes>
            <Route path="/login" Component={Login} />
            <Route path="/registrar" Component={Register} />

            <Route path='/' element={<PrivateRoute/>}>
                <Route exact path="/" Component={Home} />
                <Route path="/home" Component={Home} />
                <Route path="/listaAcoes" Component={ListaAcoes} />
                <Route path="/top10" Component={Top10} />
                <Route path="/sentimento" Component={Sentimento} />
                <Route path="/favoritas" Component={Favorita} />
                <Route path="/minhaCarteira" Component={MinhaCarteira} />
                <Route path="/minhasOpcoes" Component={MinhasOpcoes} />
            </Route>
        </Routes>
    );
}

export default Rotas;