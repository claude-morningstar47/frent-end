import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { customHistory } from "../_helpers";
import { usersActions, alertActions } from "../_store";
import { lowerCase } from "lodash"; // Add this line to import the lowerCase function

export function AddEdit() {
  const { userId } = useParams();
  const [title, setTitle] = useState();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state?.users.item);

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (userId) {
      setTitle("Edit User");

      dispatch(usersActions.getById(userId))
        .unwrap()
        .then((user) => reset(user));
    } else {
      setTitle("Add User");
    }
  }, [dispatch, reset, userId]);

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      let message;

      const formattedRoles = data.roles.map((role) =>
        lowerCase(role.replace("ROLE_", ""))
      );

      const updateData = {
        ...data,
        roles: formattedRoles,
      };

      if (userId) {
        const response = await dispatch(
          usersActions.update({ userId, updateData })
        ).unwrap();
        message = response.message || "User updated";
      } else {
        // console.log(updateData);
        const response = await dispatch(usersActions.addUser(updateData)).unwrap();
        message = response.message || "User added";
      }
      // redirect to users list with success message
      customHistory.navigate("/users");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  const handleCancel = () => {
    customHistory.navigate("/users");
  };

  return (
    // <div className="p-4 bg-white shadow-lg rounded-lg">

    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h4 className="text-xl font-bold mb-4">{title}</h4>

      {/* ... Vos autres éléments HTML ... */}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            {...register("firstName")}
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-sm mt-1">
            {errors.firstName?.message}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            {...register("lastName")}
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-sm mt-1">
            {errors.lastName?.message}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email")}
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-sm mt-1">
            {errors.email?.message}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
            {userId && (
              <em className="ml-1 text-xs text-gray-600">
                (Leave blank to keep the same password)
              </em>
            )}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            {...register("password")}
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <div className="text-red-500 text-sm mt-1">
            {errors.password?.message}
          </div>
        </div>
        {/* ... Ajoutez les autres champs ici avec la même structure ... */}

        <div className="mb-4">
          <label
            htmlFor="roles"
            className="block text-sm font-medium text-gray-700"
          >
            Roles
          </label>
          <div className="mt-1 flex">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="roles"
                value="user"
                {...register("roles", {
                  setValueAs: () => "user",
                })}
                className={`form-checkbox h-4 w-4 text-indigo-600 ${
                  errors.roles ? "border-red-500" : ""
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">User</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="roles"
                value="moderator"
                {...register("roles", {
                  setValueAs: () => "moderator",
                })}
                className={`form-checkbox h-4 w-4 text-indigo-600 ${
                  errors.roles ? "border-red-500" : ""
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">Moderator</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="roles"
                value="admin"
                {...register("roles", {
                  setValueAs: () => "admin",
                })}
                className={`form-checkbox h-4 w-4 text-indigo-600 ${
                  errors.roles ? "border-red-500" : ""
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">Admin</span>
            </label>
          </div>
          <div className="text-red-500 text-sm mt-1">
            {errors.roles?.message}
          </div>
        </div>

        <div className="flex items-center justify-end mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="mr-4 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Save
          </button>
          <button
            onClick={() => reset()}
            type="button"
            disabled={isSubmitting}
            className="mr-4 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Reset
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
      {/* </div> */}

      {/* 
      <div className="">
        {!(user?.loading || user?.error) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
              <div className="mb-4">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <TextInput
                  id="firstName"
                  name="firstName"
                  {...register("firstName")}
                  className={`border-0 px-3 py-2 mt-1 rounded ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                <div className="text-red-500 text-sm mt-1">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <TextInput
                  id="lastName"
                  name="lastName"
                  {...register("lastName")}
                  className={`border-0 px-3 py-2 mt-1 rounded ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                <div className="text-red-500 text-sm mt-1">
                  {errors.lastName?.message}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <TextInput
                id="email"
                name="email"
                {...register("email")}
                className={`border-0 px-3 py-2 mt-1 rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              <div className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </div>
            </div>

            <div className="flex">
              <Label htmlFor="roles" className="text-sm font-medium">
                Roles
              </Label>
              <div>
                <TextInput
                  type="checkbox"
                  id="roles"
                  name="roles"
                  value="ROLE_USER"
                  {...register("roles", {
                    setValueAs: () => ["user"],
                  })}
                  className={`border-0 px-3 py-2 mt-1 mr-2 ${
                    errors.roles ? "border-red-500" : ""
                  }`}
                />
                <Label htmlFor="user-role" className="text-sm">
                  USER
                </Label>
              </div>
              <div>
                <TextInput
                  type="checkbox"
                  id="roles"
                  name="roles"
                  value="ROLE_MODERATOR"
                  {...register("roles", {
                    setValueAs: () => ["moderator"],
                  })}
                  className={`border-0 px-3 py-2 mt-1 mr-2 ${
                    errors.roles ? "border-red-500" : ""
                  }`}
                />
                <Label htmlFor="moderator-role" className="text-sm">
                  MODERATOR
                </Label>
              </div>
              <div>
                <TextInput
                  type="checkbox"
                  id="roles"
                  name="roles"
                  value="ROLE_ADMIN"
                  {...register("roles", {
                    setValueAs: () => ["admin"],
                  })}
                  className={`border-0 px-3 py-2 mt-1 mr-2 ${
                    errors.roles ? "border-red-500" : ""
                  }`}
                />
                <Label htmlFor="admin-role" className="text-sm">
                  ADMIN
                </Label>
              </div>
              <div className="text-red-500 text-sm mt-1">
                {errors.roles?.message}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
                {userId && (
                  <em className="ml-1 text-xs text-gray-600">
                    (Leave blank to keep the same password)
                  </em>
                )}
              </Label>
              <TextInput
                id="password"
                name="password"
                type="password"
                {...register("password")}
                className={`border-0 px-3 py-2 mt-1 rounded ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <div className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mr-2 rounded bg-blue-500 hover:bg-blue-600 text-white focus:outline-none"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                )}
                Save
              </Button>
              <Button
                onClick={() => reset()}
                type="button"
                disabled={isSubmitting}
                className="rounded bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
              >
                Reset
              </Button>
            </div>
          </form>
        )}
      </div> */}
    </div>
  );
}
