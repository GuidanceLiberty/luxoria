

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useFormik } from 'formik'
import toast from 'react-hot-toast';
import { RiCheckLine, RiUser5Line } from '@remixicon/react';
import { userSchema } from '../../../schemas';

const ModifyUserModal = ({ user, userInfo, mutate, URL, showModal, closeModal }) => {
  const onSubmit = async (values, actions) => {
    const answer = window.confirm('Are you sure you want to update user role ?');
    if (!answer) return;

    if (user?.role !== 'admin') {
      toast.error('Only admins can update roles');
      return;
    }

    try {
      actions.setSubmitting(true);

      const response = await fetch(`${URL}/auth/update-user-role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.message);
        mutate?.();
        actions.resetForm();
        setTimeout(() => closeModal?.(), 0);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (err) {
      console.log('Error updating user role:', err?.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      _id: userInfo?._id,
      name: userInfo?.name,
      role: userInfo?.role,
    },
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Update {values?.name} Role</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input
                    type="hidden"
                    id="_id"
                    name="_id"
                    value={values?._id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {/* Role Select */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label d-flex align-items-center gap-1">
                      <RiUser5Line size={18} /> Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      className={`form-select ${touched.role && errors.role ? 'is-invalid' : ''}`}
                      value={values?.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select User Role</option>
                      <option value="user">User Role</option>
                      <option value="admin">Admin Role</option>
                    </select>
                    {touched.role && errors.role ? (
                      <div className="invalid-feedback">{errors.role}</div>
                    ) : null}
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    <RiCheckLine size={18} /> Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default ModifyUserModal;
