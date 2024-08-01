/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { PrivateRoutes } from "../../../../models/index";
import "./headerAdmin.scss";
import { useSelector } from "react-redux";

const HeaderAdmin = () => {
  const [stateHam2, setStateHam2] = useState(true);
  const location = useLocation();

  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const handleResize = () => {
    setTimeout(() => {
      initializeHeaderAdmin();
    }, 200);
  };

  const initializeHeaderAdmin = () => {
    const navbarp2 = document.getElementById("n-exclusivo");
    const tabsp = navbarp2.querySelectorAll("li");

    const activeItemp = navbarp2.querySelector(".active");
    const horiSelector = document.querySelector(".hori-selector-2");
    const currentPath = location.pathname;

    const hrefs = Array.from(navbarp2.querySelectorAll("li a"), (link) =>
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

      const navbarp2 = document.getElementById("n-exclusivo");
      const tabs = navbarp2.querySelectorAll("li");
      const activeItem = navbarp2.querySelector(".active");

      const activeItemHeight = activeItem.offsetHeight;
      const activeItemWidth = activeItem.offsetWidth;
      const itemTop = activeItem.offsetTop;
      const itemLeft = activeItem.offsetLeft;

      horiSelector.style.top = `${itemTop}px`;
      horiSelector.style.left = `${itemLeft}px`;
      //horiSelector.style.height = `${activeItemHeight - 2}px`;
      horiSelector.style.width = `${activeItemWidth}px`;

      for (const item of tabs) {
        item.addEventListener("click", () => {
          for (const menuItem of tabs) {
            menuItem.classList.remove("active");
          }
          item.classList.add("active");

          if (stateHam2) {
            setStateHam2(false);
          }

          const itemHeight = item.offsetHeight;
          const itemWidth = item.offsetWidth;
          const itemTop = item.offsetTop;
          const itemLeft = item.offsetLeft;
          horiSelector.style.top = `${itemTop}px`;
          horiSelector.style.left = `${itemLeft}px`;
          horiSelector.style.height = `${itemHeight - 2}px`;
          horiSelector.style.width = `${itemWidth}px`;
        });
      }
    } else {
      activeItemp?.classList?.remove("active");
      horiSelector.style.display = "none";
    }
  };

  useEffect(() => {
    initializeHeaderAdmin();
    window.addEventListener("resize", handleResize);
  }, [location.pathname]);

  return (
    <header className="header-exclusivo">
      <nav id="n-exclusivo" className="nav-bar-admin">
        <ul>
          <div className="hori-selector-2">
            <div className="left" />
            <div className="right" />
          </div>
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
          <li>
            <Link to={`./${PrivateRoutes.SETTING}`}>Ajustes</Link>
          </li>
          {InfoNegocio?.oldOrder ? (
            <li>
              <Link to={`./${PrivateRoutes.REGISTER_OLDS}`}>
                Registro Antiguos
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
