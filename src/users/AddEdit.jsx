import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { customHistory } from "../_helpers";
import { usersActions, alertActions } from "../_store";
import { Button, Label, TextInput } from "flowbite-react";

export function AddEdit() {
  const { userId } = useParams();
  const [title, setTitle] = useState();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.users.item);

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

      if (userId) {
        const response = await dispatch(
          usersActions.update({ userId, data })
        ).unwrap();
        message = response.message || "User updated";
      } else {
        console.log(data);
        const response = await dispatch(usersActions.addUser(data)).unwrap();
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
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h4 className="text-xl font-bold mb-4">{title}</h4>

      <Button
        type="button"
        onClick={handleCancel}
        className="rounded bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
      >
        Cancel
      </Button>

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

            {/* <div className="mb-4"> */}
            <div className="flex">
              <Label htmlFor="roles" className="text-sm font-medium">
                Roles
              </Label>
              <div>
                <TextInput
                  type="checkbox"
                  id="user-role"
                  name="roles"
                  value="ROLE_USER"
                  {...register("roles", {
                    setValueAs: () => "user",
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
                  id="moderator-role"
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
                  id="admin-role"
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
      </div>
    </div>
  );
}
