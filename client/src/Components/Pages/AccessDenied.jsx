import { NavLink } from 'react-router-dom';
import { RiArrowLeftLine, RiShieldLine } from '@remixicon/react';

const AccessDenied = () => {
  return (
    <section className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="text-center">
        <RiShieldLine size={80} className="text-danger mb-3" />
        <h3 className="text-light mb-2">Access Denied</h3>
        <hr className="border-secondary w-50 mx-auto" />
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <RiArrowLeftLine className="text-secondary" size={20} />
          <NavLink to="/" className="text-decoration-none text-secondary fw-medium">
            Back to Home
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default AccessDenied;
