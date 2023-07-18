import { Routes, Route } from "react-router-dom";
import { UsersList, AddEdit } from "./";
 
export function UsersLayout() {
  return (
    <>
      <Routes>
        <Route index element={<UsersList />} />
        <Route path="add" element={<AddEdit />} />
        <Route path="edit/:userId" element={<AddEdit />} />
      </Routes>
    </>
  );
}
