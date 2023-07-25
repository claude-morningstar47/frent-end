import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { usersActions } from "../_store";

export function UsersList() {
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.users?.list);

  useEffect(() => {
    if (!usersList) {
      dispatch(usersActions.getAll());
    }
  }, [dispatch, usersList]);

  if (!usersList) {
    return null; // or return a loading indicator if desired
  }

  if (!Array.isArray(usersList)) {
    return <div>Error: Invalid user list</div>; // or handle the error appropriately
  }

  return (
    <div>
      <Link to="add" className="btn btn-primary btn-sm mb-2">
        Add User
      </Link>

      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <table className="w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">First Name</th>
            <th className="py-2 px-4 border-b">Last Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Satus</th>
            <th className="py-2 px-4 border-b">Roles</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {usersList?.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            usersList?.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                {/* <td className="py-2 px-4 border-b">{user.isActive}</td> */}
                {/* <td className="py-2 px-4 border-b">{user.isActive ? "En ligne" : "Hors ligne"}</td> */}
                <td className="py-2 px-4 border-b">
                  <span
                    className={`badge ${
                      user.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.isActive ? "En ligne" : "Hors ligne"}
                  </span>
                </td>

                <td className="py-2 px-4 border-b">{user.roles.join(", ")}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`edit/${user.id}`}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => dispatch(usersActions.delete(user.id))}
                    disabled={user.isDeleting}
                    className="text-red-500 hover:underline"
                  >
                    {user.isDeleting ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></span>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
          {usersList.loading && (
            <tr>
              <td colSpan="5" className="py-4 text-center">
                <span className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-gray-900"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
