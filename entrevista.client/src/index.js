import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import Nav from "./Nav";
import InicioPage from "./Pages/InicioPage";
import UsuariosPage from "./Pages/UsuariosPage";

function App() {
  const navRef = useRef();
  var handleActualizarUsuario = () => {
    navRef.current.actualizarUsuario();
  };
  return (
    <FluentProvider
      style={{ fontFamily: '"DM Sans", serif' }}
      theme={webLightTheme}
    >
      <BrowserRouter>
        <Nav ref={navRef} />
        <Routes>
          <Route
            path="/"
            element={<InicioPage onActualizarUsuario={handleActualizarUsuario} />}
          />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}

const root = createRoot(document.getElementById("root")); // notice the '!'
root.render(<App />);
