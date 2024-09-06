import { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import "./header.scss";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import {Badge} from "primereact/badge";
import { useCookies } from "react-cookie";
import useToast from "../../../hook/toast/toast";

function Header() {
  const { showToast } = useToast();
  const [cookies, setCookie, removeCookie] = useCookies(["ACCESS_TOKEN"]);
  const navigation = useNavigate();
  const menu = useRef<Menu>(null);

  const itemsMenuRight = [
    {
      template: (item: any, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
            )}
          >
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              className="mr-2"
              shape="circle"
            />
            <div className="flex flex-column align">
              <span className="font-bold">Dương Đức Anh</span>
              <span className="text-sm">Admin</span>
            </div>
          </button>
        );
      },
    },
    {
      command: () => {
        navigation("/admin/setting");
      },
      label: "Setting",
      icon: "pi pi-cog",
    },
    {
      command: () => {
        showToast("Logout successfully", 'success');
        removeCookie('ACCESS_TOKEN')
      },
      label: "Logout",
      icon: "pi pi-sign-out",
    },
  ];

  const itemsMenuLeft = [
    {
      label: "Subject",
      icon: "pi pi-server",
      items: [
        {
          label: "DGT",
          icon: "pi pi-shield",
          command: () => {
            navigation("/role");
          },
        },
      ],
    },
    {
      label: "Dashboard",
      icon: "pi pi-chart-bar",
      command: () => {
        navigation("/chart");
      },
    },
  ];

  return (
    <header className="header-admin-page">
      <Menubar className="header-admin-page-menu-bar" model={itemsMenuLeft} />

      <Menu
        model={itemsMenuRight}
        popup
        ref={menu}
        id="menu"
        popupAlignment="right"
      />
      <section>
        <i className="pi pi-bell p-overlay-badge">
          <Badge value="2"></Badge>
        </i>
        <Avatar
            className='ml-4'
            label="D"
            size="large"
            onClick={(event) => menu.current?.toggle(event)}
            aria-controls="menu"
            aria-haspopup
        />
      </section>
    </header>
  );
}

export default Header;