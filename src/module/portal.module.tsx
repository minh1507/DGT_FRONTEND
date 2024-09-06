import * as React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {lazy} from "react";

const portalNamespace = {
    Home: lazy(() => import("./home/home")),
    Auth: lazy(() => import("./auth/auth")),
};

const SharedNamespace = {
    Error: lazy(() => import("../component/error/error")),
};

const LayoutNamespace = {
    Layout: lazy(() => import("../component/layout/main/main")),
}


function PortalModule() {
    return (
        <Routes>
            <Route path="login" element={<portalNamespace.Auth/>}/>
            <Route path="" element={<LayoutNamespace.Layout/>}>
                <Route path="/" element={<portalNamespace.Home/>}/>
                <Route path="home" element={<Navigate to="/"/>}/>
            </Route>
            <Route path="*" element={<SharedNamespace.Error/>}/>
            <Route path="*" element={<SharedNamespace.Error/>}/>
        </Routes>
    );
}

export default PortalModule;