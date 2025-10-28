
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Login = () => {
  // Cambiamos el estado para usar email y password
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Desestructuramos con los nuevos nombres
  const { email, password } = inputs;

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      // Creamos el objeto con los campos correctos para el backend
      const usuario = {
        email,
        password,
      };
      setLoading(true);
      try {
        const { data } = await axios.post("http://localhost:4000/login", usuario);
        localStorage.setItem("token", data?.usuario.token);
        localStorage.setItem("userId", data?.usuario.id);
        setMensaje(data.mensaje);
        setTimeout(() => {
          setMensaje("");
          navigate("/welcome");
        }, 1500);
      } catch (error) {
        console.error(error);
        // Usamos el mensaje de error del backend para más claridad
        const errorMsg = error.response?.data?.mensaje || "Credenciales incorrectas.";
        setMensaje(errorMsg);
        setTimeout(() => {
          setMensaje("");
        }, 2500);
      }
      // Limpiamos el formulario después del intento
      setInputs({ email: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={onSubmit}>
        <h2 className={styles.authTitle}>Inicio de Sesión</h2>
        {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
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
            placeholder="Tu contraseña"
            autoComplete="off"
            required
          />
        </div>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
        <p className={styles.switchAuth}>
          ¿No tienes una cuenta? <a href="/">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
