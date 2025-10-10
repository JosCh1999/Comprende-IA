import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainView from "./MainView"; // Importamos el nuevo componente principal

const Welcome = () => {
  const [user, setUser] = useState(null); // Guardaremos el objeto de usuario completo
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Asumimos que guardas el ID al hacer login

    if (token && userId) {
      axios
        .get(`http://localhost:4000/user/${userId}`, { // Usamos la ruta correcta con el ID
          headers: {
            token: token,
          },
        })
        .then(({ data }) => setUser(data)) // Guardamos todo el objeto de usuario
        .catch((error) => {
            console.error("Error al obtener los datos del usuario:", error);
            // Si hay un error (token inválido, etc.), limpiamos y redirigimos
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
        });
    } else {
        // Si no hay token o ID, no debería estar aquí
        navigate("/login");
    }
  }, [navigate]); // Agregamos navigate a las dependencias de useEffect

  // Mientras carga los datos del usuario, mostramos un mensaje
  if (!user) {
    return <div>Cargando...</div>;
  }

  // Una vez que tenemos los datos del usuario, renderizamos la vista principal
  return <MainView user={user} />;
};

export default Welcome;
