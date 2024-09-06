import { useState } from "react";
import HomeAdminPage from '../../assets/home-admin.jpg'
import "./home.scss";
import { useTitle } from "../../hook/title/title";


function Home() {
  useTitle('home')

  return (
    <section className="home-admin-page">
      <img src={HomeAdminPage} alt="..." />
      <p>{'main'}</p>
    </section>
  );
}

export default Home;