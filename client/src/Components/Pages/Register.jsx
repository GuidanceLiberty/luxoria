import { RiLock2Line, RiMailLine, RiPhoneLine, RiUser3Line } from '@remixicon/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import placeholder from "../../assets/store-01.webp";
import bgImage from "../../assets/store-01.webp";
import logo from "../../assets/store-01.webp";
import { registerSchema } from '../../schemas';

const Register = () => {
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BASE_URL;

  const onSubmit = async (values, actions) => {
    const answer = window.confirm('Are you sure you want to signup?');
    if (!answer) return;

    try {
      const response = await fetch(`${URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // short delay for UX
        actions.resetForm();
        navigate('/login'); // ✅ Navigate to login after successful signup
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Error occurred while signing up:', error);
      toast.error('Error occurred while signing up');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      photo: placeholder,
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting } = formik;

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card p-4 shadow" style={{ maxWidth: '450px', width: '100%', backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="logo" className="mb-2" style={{ width: '50px', height: '50px' }} />
          <h3>Sign Up</h3>
          <hr className="border border-warning w-50 mx-auto" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <RiUser3Line className="me-1" /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <RiMailLine className="me-1" /> Email
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

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <RiLock2Line className="me-1" /> Password
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

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="form-label">
              <RiPhoneLine className="me-1" /> Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
              placeholder="Phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Register'}
            </button>
            <NavLink to="/login" className="btn btn-outline-secondary">
              Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
