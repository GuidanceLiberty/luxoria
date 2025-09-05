import { NavLink, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiGlobalLine } from '@remixicon/react'

const NotFound = () => {
  const userData = localStorage.getItem('userData');
  const user = JSON.parse(userData);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_BASE_URL;

  return (
    <section className="bg-dark text-light d-flex justify-content-center align-items-center vh-100 p-3">
      <div className="text-center">
        <RiGlobalLine className="text-danger mb-3" style={{ width: '80px', height: '80px' }} />
        <p className="text-secondary fs-5">Page Not Found</p>

        <hr className="border-secondary w-50 mx-auto" />

        <div className="d-flex justify-content-center align-items-center gap-2 text-secondary fs-6 mt-3">
          <RiArrowLeftLine />
          <NavLink to={`/`} className="text-decoration-none text-secondary hover-opacity">
            Back to home
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default NotFound
