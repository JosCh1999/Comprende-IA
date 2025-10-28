
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Register = () => {
  const [inputs, setInputs] = useState({
    nombre: "",
    email: "", // Cambiado de correo a email
    password: "", // Cambiado de contraseña a password
  });
  const [mensaje, setMensaje] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Desestructuramos con los nuevos nombres
  const { nombre, email, password } = inputs;

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (nombre !== "" && email !== "" && password !== "") {
      // Creamos el objeto con los campos correctos para el backend
      const usuario = {
        nombre,
        email,
        password,
      };
      setLoading(true);
      try {
        const { data } = await axios.post("http://localhost:4000/register", usuario);
        setMensaje(data.mensaje);
        setTimeout(() => {
          setMensaje("");
          navigate("/login");
        }, 1500);
      } catch (error) {
        console.error(error);
        // Mostramos un mensaje más específico si está disponible
        const errorMsg = error.response?.data?.mensaje || "Hubo un error en el registro.";
        setMensaje(errorMsg);
        setTimeout(() => {
          setMensaje("");
        }, 2500);
      }
      // Limpiamos el formulario después del intento
      setInputs({ nombre: "", email: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={onSubmit}>
        <h2 className={styles.authTitle}>Crear una Cuenta</h2>
        {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="nombre">Nombre Completo</label>
          <input
            className={styles.inputField}
            onChange={handleChange}
            value={nombre}
            name="nombre"
            id="nombre"
            type="text"
            placeholder="Tu nombre completo"
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          {/* Actualizado para 'email' */}
          <label className={styles.inputLabel} htmlFor="email">Correo Electrónico</label>
          <input
            className={styles.inputField}
            onChange={handleChange}
            value={email}
            name="email"
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          {/* Actualizado para 'password' */}
          <label className={styles.inputLabel} htmlFor="password">Contraseña</label>
          <input
            className={styles.inputField}
            onChange={handleChange}
            value={password}
            name="password"
            id="password"
            type="password"
            placeholder="Crea una contraseña segura"
            autoComplete="off"
            required
          />
        </div>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className={styles.switchAuth}>
          ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
