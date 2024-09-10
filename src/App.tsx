import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import { ToastProvider } from "./component/toast/toast";
import PortalModule from "./module/portal.module";
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <BrowserRouter>
            <Suspense>
                <ToastProvider>
                    <RecoilRoot>
                        <PortalModule/>
                    </RecoilRoot>
                </ToastProvider>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;