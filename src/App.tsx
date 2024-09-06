import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import { ToastProvider } from "./component/toast/toast";
import PortalModule from "./module/portal.module";

function App() {
    return (
        <BrowserRouter>
            <Suspense>
                <ToastProvider>
                    <PortalModule/>
                </ToastProvider>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;