/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { PrivateRoutes, Roles } from "../../../../models/index";
import Logout from "../../Logout/Logout";
import "./headerCoord.scss";

import { ReactComponent as Logo } from "../../../../utils/img/Logo/logo.svg";

const HeaderUser = () => {
  const userState = useSelector((store) => store.user.infoUsuario);
  const location = useLocation();
  const [stateHam, setStateHam] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 900);

  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const toggleNavBar = () => {
    const navBar = document.querySelector(".nav-bar");
    const hamburger = document.querySelector(".hamburger");
    navBar.classList.toggle("active");
    hamburger.classList.toggle("active");
  };

  const handleResize = () => {
    setTimeout(() => {
      initializeHeaderUser();
    }, 200);
  };

  const initializeHeaderUser = () => {
    const navbarp = document.getElementById("n-general");
    const tabsp = navbarp.querySelectorAll("li");

    const activeItemp = navbarp.querySelector(".active");
    const horiSelector = document.querySelector(".hori-selector");
    const currentPath = location.pathname;

    const hrefs = Array.from(navbarp.querySelectorAll("li a"), (link) =>
      link.getAttribute("href")
    );

    hrefs.push("/");

    if (hrefs.includes(currentPath)) {
      activeItemp?.classList?.remove("active");

      for (const tab of tabsp) {
        const link = tab.querySelector("a");
        const linkHref = link?.getAttribute("href");

        if (
          (currentPath === "/" && linkHref === "/list-clientes") ||
          currentPath === linkHref
        ) {
          horiSelector.style.display = "block";
          tab.classList.add("active");
        }
      }

      const navbar = document.getElementById("n-general");
      const tabs = navbar.querySelectorAll("li");
      const activeItem = navbar.querySelector(".active");

      const activeItemHeight = activeItem.offsetHeight;
      const activeItemWidth = activeItem.offsetWidth;
      const itemTop = activeItem.offsetTop;
      const itemLeft = activeItem.offsetLeft;

      horiSelector.style.top = `${itemTop}px`;
      horiSelector.style.left = `${itemLeft}px`;
      //horiSelector.style.height = `${activeItemHeight}px`;
      horiSelector.style.width = `${activeItemWidth}px`;

      for (const item of tabs) {
        item.addEventListener("click", () => {
          for (const menuItem of tabs) {
            menuItem.classList.remove("active");
          }
          item.classList.add("active");

          if (stateHam) {
            setStateHam(false);
          }

          const itemHeight = item.offsetHeight;
          const itemWidth = item.offsetWidth;
          const itemTop = item.offsetTop;
          const itemLeft = item.offsetLeft;
          horiSelector.style.top = `${itemTop}px`;
          horiSelector.style.left = `${itemLeft}px`;
          //horiSelector.style.height = `${itemHeight - (isSmallScreen ? 0 : 10)}px`;

          horiSelector.style.width = isSmallScreen ? "100%" : `${itemWidth}px`;
        });
      }
    } else {
      activeItemp?.classList?.remove("active");
      horiSelector.style.display = "none";
    }
  };

  useEffect(() => {
    initializeHeaderUser();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header-general">
      <div className="logo">
        <Logo className="svg-logo" />
      </div>
      <button type="button" className="hamburger" onClick={toggleNavBar}>
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </button>
      <nav id="n-general" className="nav-bar">
        <ul>
          <div className="hori-selector">
            <div className="left" />
            <div className="right" />
          </div>
          <li>
            <Link
              to={`./${PrivateRoutes.LIST_ORDER_SERVICE}`}
              className="active"
            >
              Listado de Pedido
            </Link>
          </li>
          {userState.rol === Roles.ADMIN ||
          userState.rol === Roles.GERENTE ||
          userState.rol === Roles.COORD ? (
            <>
              <li>
                <Link to={`./${PrivateRoutes.REGISTER}`}>
                  {InfoNegocio?.hasMobility ? "REGISTRAR" : "Tienda"}
                </Link>
              </li>

              {/* 
                 <li>
                <Link to={`./${PrivateRoutes.REGISTER_PRELIMINAR}`}>
                  PRELIMINAR
                </Link>
              </li>
               */}
              {!InfoNegocio?.hasMobility ? (
                <li>
                  <Link to={`./${PrivateRoutes.REGISTER_DELIVERY}`}>
                    Delivery
                  </Link>
                </li>
              ) : null}
              <li>
                <Link to={`./${PrivateRoutes.CUADRE_CAJA}`}>
                  Cuadre de Caja
                </Link>
              </li>
            </>
          ) : null}

          {(userState.rol === Roles.ADMIN || userState.rol === Roles.GERENTE) &&
          isSmallScreen ? (
            <>
              <li>
                <Link to={`./${PrivateRoutes.PERSONAL}`} className="active">
                  ASISTENCIA
                </Link>
              </li>
              <li>
                <Link to={`./${PrivateRoutes.CLIENTES}`}>Clientes</Link>
              </li>

              <li>
                <Link to={`./${PrivateRoutes.PROMOCIONES}`}>Promociones</Link>
              </li>
              <li>
                <Link to={`./${PrivateRoutes.REPORTES}`}>Reportes</Link>
              </li>
              <li className="pages-admin">
                <Link to={`./${PrivateRoutes.SETTING}`}>Ajustes</Link>
              </li>
              {InfoNegocio?.oldOrder ? (
                <li>
                  <Link to={`./${PrivateRoutes.REGISTER_OLDS}`}>
                    Registro Antiguos
                  </Link>
                </li>
              ) : null}
            </>
          ) : null}
          <Logout />
        </ul>
      </nav>
    </header>
  );
};

export default HeaderUser;
