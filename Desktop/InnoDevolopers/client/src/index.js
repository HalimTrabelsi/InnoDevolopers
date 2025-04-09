import React from "react";
import ReactDOM from "react-dom/client";
import 'react-quill/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from "./App";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.min.css" />

    <App />
  </>
);

