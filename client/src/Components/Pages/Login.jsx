/* eslint-disable no-unused-vars */
import { RiLock2Line, RiMailLine } from '@remixicon/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import logo from "../../assets/store-02.webp";
import bgImage from "../../assets/store-01.webp";
import { loginSchema } from "../../schemas";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

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