/* eslint-disable no-unused-vars */
import { RiLock2Line, RiMailLine } from '@remixicon/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';
import logo from "../../assets/store-02.webp";
import bgImage from "../../assets/store-01.webp";
import { loginSchema } from "../../schemas";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const URL = import.meta.env.VITE_BASE_URL || "http://localhost:6060/api";
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // ✅ Hard refresh exactly once whenever /login is visited
  const didRun = useRef(false);
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (location.pathname === "/login") {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("r")) {
        // First visit -> add flag and force a full page load
        params.set("r", "1");
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.location.replace(newUrl); // full reload, no loop
      } else {
        // Reloaded with ?r=1 -> clean up the URL
        params.delete("r");
        const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, [location.pathname]);

  const onSubmit = async (values, actions) => {
    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const res = await response.json();

      if (!res?.success) {
        toast.error(res?.message);
        return;
      }

      // Store in AuthContext (and your context persists to localStorage)
      login(res.user);
      toast.success(res.message);

      actions.resetForm();
      navigate('/');
    } catch (error) {
      toast.error("Error occurred while login: " + error.message);
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit,
  });

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting } = formik;

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="logo" className="mb-2" style={{ width: '40px', height: '40px' }} />
          <h3>Login</h3>
          <hr className="border border-warning w-50 mx-auto" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <RiMailLine size={15} className="me-1" /> Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <RiLock2Line size={15} className="me-1" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in ...' : 'Sign in'}
            </button>
            <NavLink to="/register" className="btn btn-outline-secondary">
              Sign up
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
