import { RiPencilLine, RiSettings2Line } from '@remixicon/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import placeholder from '../../assets/placeholder.jpg';
import { resolveDate } from '../../lib';
import ModifyUserModal from '../../Components/modals/users/ModifyUserModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const URL = import.meta.env.VITE_BASE_URL;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: users, mutate } = useSWR(`${URL}/auth/users`, fetcher);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate(`/access-denied`);
    }
  }, [user]);

  return (
    <section className="bg-light p-3">
      <div className="mb-4">
        <h4 className="fw-bold text-capitalize">Manage Users</h4>
        <div className="border-top border-3 border-warning w-25"></div>
      </div>

      <div className="table-responsive shadow-sm border border-secondary p-2 rounded">
        <table className="table align-middle table-hover">
          <thead className="table-secondary text-uppercase small">
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created On</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.data?.map((u, index) => (
              <tr key={u._id} className={index % 2 !== 0 ? 'table-light' : ''}>
                <td>
                  <img src={u.imgUrl || placeholder} alt={u.name} className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`badge rounded-pill px-3 py-1 ${u.role === 'admin' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{resolveDate(u.createdAt, 'year')}</td>
                <td className="text-end">
                  <RiPencilLine onMouseOver={() => setUserInfo(u)} onClick={() => setShowModal(true)} className="cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModifyUserModal user={user} userInfo={userInfo} mutate={mutate} URL={URL} showModal={showModal} closeModal={() => setShowModal(false)} />
    </section>
  );
};

export default ManageUsers;
