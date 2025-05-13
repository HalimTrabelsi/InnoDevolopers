import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import axios from "axios";
import io from "socket.io-client";
import Swal from "sweetalert2";

const socket = io("http://localhost:5001", { withCredentials: true });

// Utility function to translate text nodes while preserving HTML structure
const translateElement = async (element, langCode, cache = {}) => {
  if (
    element.nodeType !== Node.ELEMENT_NODE ||
    element.hasAttribute("data-no-translate") ||
    ["SCRIPT", "STYLE", "CODE", "PRE", "INPUT", "TEXTAREA"].includes(element.tagName)
  ) {
    return;
  }

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      const text = child.textContent.trim();
      const cacheKey = `${text}:${langCode}`;

      if (cache[cacheKey]) {
        child.textContent = cache[cacheKey];
        continue;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/translate",
          {
            q: text,
            source: "auto",
            target: langCode,
            format: "text",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const translatedText = response.data.translatedText;
        child.textContent = translatedText;
        cache[cacheKey] = translatedText;
      } catch (error) {
        console.error(`Translation failed for text: "${text}"`, error);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      await translateElement(child, langCode, cache);
    }
  }
};

const MasterLayoutaccountant = ({ children }) => {
  const [translationCache] = useState(() => {
    const saved = localStorage.getItem("translationCache");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    localStorage.setItem("translationCache", JSON.stringify(translationCache));
  }, [translationCache]);

  const handleLanguageChange = async (langCode) => {
    try {
      const areasToTranslate = [
        document.querySelector(".dashboard-main-body"),
        document.querySelector(".sidebar-menu"),
        document.querySelector(".navbar-header"),
        document.querySelector(".d-footer"),
      ].filter(Boolean);

      if (areasToTranslate.length === 0) {
        throw new Error("No translatable areas found");
      }

      for (const area of areasToTranslate) {
        await translateElement(area, langCode, translationCache);
      }

      setCurrentLanguage(langCode);

      // Inline RTL handling
      if (langCode === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.style.direction = "rtl";
        document.documentElement.style.textAlign = "right";
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.style.direction = "ltr";
        document.documentElement.style.textAlign = "left";
      }

      Swal.fire({
        title: "Language Changed!",
        text: `The page has been translated to ${langCode}.`,
        icon: "success",
      });
    } catch (err) {
      console.error("Translation failed:", err.message);
      Swal.fire({
        title: "Translation Error",
        text: "Could not translate the page. Please try again.",
        icon: "error",
      });
    }
  };

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("newApproval", (message) => {
      console.log("Received newApproval:", message);
      setNotifications((prev) => {
        const updatedNotifications = [...prev, message];
        const notificationArea = document.querySelector(
          ".dropdown-menu-lg .max-h-400-px"
        );
        if (notificationArea) {
          translateElement(notificationArea, currentLanguage, translationCache);
        }
        return updatedNotifications;
      });
    });

    socket.on("approvalStatus", (message) => {
      console.log("Received approvalStatus:", message);
      setNotifications((prev) => {
        const updatedNotifications = [...prev, message];
        const notificationArea = document.querySelector(
          ".dropdown-menu-lg .max-h-400-px"
        );
        if (notificationArea) {
          translateElement(notificationArea, currentLanguage, translationCache);
        }
        return updatedNotifications;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newApproval");
      socket.off("approvalStatus");
    };
  }, [currentLanguage]);

  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("http://localhost:5001/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/sign-in");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5001/api/users/logout");
      localStorage.removeItem("token");
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px";
        }
      });

      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        }
      }
    };

    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            }
          }
        });
      });
    };

    openActiveDropdown();

    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  const sidebarControl = () => {
    setSidebarActive(!sidebarActive);
  };

  const mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/" className="sidebar-logo">
            <img
              src="images/finova-logo.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="assets/images/logo-light.png"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="assets/images/logo-icon.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="solar:home-smile-angle-outline"
                  className="menu-icon"
                />
                <span>Dashboard</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                    AI
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-2"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    CRM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-3"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    eCommerce
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-4"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />
                    Cryptocurrency
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-5"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />
                    Investment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-6"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />
                    LMS
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-7"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    NFT & Gaming
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-8"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    Medical
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-9"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    Analytics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/financialoverview"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    Financial Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/index-11"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    Finance & Banking
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="sidebar-menu-group-title">Advanced Features</li>
           

            <li className="dropdown">
              <Link to="#">
                <i className="ri-robot-2-line mr-10" />
                <span>AI Application</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/text-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                    Text Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/code-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Code Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/image-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />
                    Image Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/voice-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />
                    Voice Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/video-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />
                    Video Generator
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <Link to="#">
                <i className="ri-btc-line mr-10" />
                <span>Crypto Currency</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/wallet"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                    Wallet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/marketplace"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Marketplace
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/marketplace-details"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Marketplace Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/portfolio"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Portfolios
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="sidebar-menu-group-title">Financial Management</li>

            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="solar:document-text-outline"
                  className="menu-icon"
                />
                <span>Components</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/typography"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                    Typography
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/colors"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Colors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/button"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />
                    Button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dropdown"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-lilac-600 w-auto" />
                    Dropdown
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="dropdown">
  <Link to="#">
    <Icon icon="heroicons:banknotes" className="menu-icon" />
    <span>Transaction</span>
  </Link>
  <ul className="sidebar-submenu">
    <li>
      <NavLink
        to="/add-transaction"
        className={(navData) =>
          navData.isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
        Add Transaction
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/ViewTransaction"
        className={(navData) =>
          navData.isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
        View Transaction
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/calender"
        className={(navData) =>
          navData.isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-success-main w-auto" />
        Track Transaction
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/HealthTransaction"
        className={(navData) =>
          navData.isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-danger-main w-auto" />
        Health Board
      </NavLink>
    </li>
  </ul>
</li>


            <li className="dropdown">
              <Link to="#">
                <Icon icon="mingcute:storage-line" className="menu-icon" />
                <span>Financial </span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/cash-flow"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                    Cash Flow
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/financial-assistant"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                     Financial Documentation
                  </NavLink>
                </li>
                 <li>
                  <NavLink
                    to="/table-data"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                     Tax
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <Link to="#">
                <Icon icon="solar:pie-chart-outline" className="menu-icon" />
                <span>Trends</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/financialoverview"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />
                    Financial Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/financial-trends"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Forecast Trend
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/financial-simulation"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />
                    Simulation
                  </NavLink>
                </li>
              </ul>
            </li>

           

           
 <li>
              <NavLink
                to="/news"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="fe:vector" className="menu-icon" />
                <span>News</span>
              </NavLink>
            </li>
           

            <li className="sidebar-menu-group-title">N/A</li>

            

         
          
            <li>
              <NavLink
                to="/sign-up/terms-conditions"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="octicon:info-24" className="menu-icon" />
                <span>Terms & Conditions</span>
              </NavLink>
            </li>
          
            <li>
              <NavLink
                to="/access-denied"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className="ri-folder-lock-line menu-icon"></i>
                <span>Access Denied</span>
              </NavLink>
            </li>
          
        

          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active"
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
                <form className="navbar-search">
                  <Icon icon="ion:search-outline" className="icon" />
                </form>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <ThemeToggleButton />
                <div className="dropdown d-none d-sm-inline-block">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="twemoji:flag-united-states"
                      className="w-24 h-24"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Choose Your Language
                        </h6>
                      </div>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-8">
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="english"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <Icon
                              icon="twemoji:flag-united-states"
                              className="w-36-px h-36-px"
                            />
                            <span className="text-md fw-semibold mb-0">
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="english"
                          onChange={() => handleLanguageChange("en")}
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="arabic"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <Icon
                              icon="twemoji:flag-saudi-arabia"
                              className="w-36-px h-36-px"
                            />
                            <span className="text-md fw-semibold mb-0">
                              العربية
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="arabic"
                          onChange={() => handleLanguageChange("ar")}
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="chinese"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <Icon
                              icon="twemoji:flag-china"
                              className="w-36-px h-36-px"
                            />
                            <span className="text-md fw-semibold mb-0">
                              中文
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="chinese"
                          onChange={() => handleLanguageChange("zh")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
               
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="solar:user-linear"
                      className="w-40-px h-40-px text-primary"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        {user ? (
                          <div>
                            <h6 className="text-lg text-primary-light fw-semibold mb-2">
                              {user.name}
                            </h6>
                            <span className="text-secondary-light fw-medium text-sm">
                              {user.role}
                            </span>
                          </div>
                        ) : (
                          <div>Loading...</div>
                        )}
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />
                          My Profile
                        </Link>
                      </li>
                   
                     
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                          to="#"
                          onClick={handleLogout}
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main-body" id="content">
          {children}
        </div>

        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">
                © 2025 <span data-no-translate>InnoDevolopers</span>. All Rights
                Reserved.
              </p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                Made by <span className="text-primary-600" data-no-translate>InnoDev</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayoutaccountant;