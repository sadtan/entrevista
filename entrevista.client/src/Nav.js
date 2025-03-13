import * as React from "react";
import { Person20Regular } from "@fluentui/react-icons";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

export default forwardRef((nul, ref) => {
  const [usuario, setUsuario] = useState(null);

  const cargarUsuarioDeAlmacenamientoLocal = () => {
    var sessionUsuario = sessionStorage.getItem("usuario");
    if (sessionUsuario) setUsuario(JSON.parse(sessionUsuario));
  };

  var handleCerrarSesion = () => {
    setUsuario(null);
    sessionStorage.removeItem("usuario");
    window.location.href = "/";
  };

  useState(() => {
    cargarUsuarioDeAlmacenamientoLocal();
  }, []);

  useImperativeHandle(ref, () => ({
    actualizarUsuario() {
      cargarUsuarioDeAlmacenamientoLocal();
    },
  }));

  return (
    <div id="header">
      {usuario && (
        <div>
          <div id="main-header">
            <span>
              {usuario["nombre"]} {usuario["apellido"]} ({usuario["clasificacion"]})
            </span>
            <span className="usuario-foto">
              <Person20Regular />
            </span>
          </div>
          <nav>
            <ul>
              <li>Usuarios</li>
              <li onClick={handleCerrarSesion}>Salir</li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
});
