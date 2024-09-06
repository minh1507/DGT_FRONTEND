import React from 'react';
import Header from '../header/header';
import { Outlet } from 'react-router-dom';
import './main.scss'

const Main = () => {
    return (
        <section className='layout-admin-page'>
            <Header />
            <main className='layout-admin-page-main'>
                <Outlet />
            </main>
        </section>
    );
};

export default Main;