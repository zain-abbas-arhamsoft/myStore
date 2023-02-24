import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { baseUrl } from "helpers/baseUrl";
function userRoles() {
  const [users, setUsers] = useState([]);
  const { token } = parseCookies();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      headers: {
        Authorization: token,
      },
    });
    const userRole = await res.json();
    // console.log("userRole", userRole);
    setUsers(userRole);
  };
  const handleRole = async (_id, role) => {
    // console.log("_id", _id);
    // console.log("role", role);
    const res = await fetch(`${baseUrl}/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        _id,
        role,
      }),
    });
    const changeRole = await res.json();
    // console.log("changeRole", changeRole);

    const updatedUser = users.map((user) => {
      if (user.role != changeRole.role && user.email == changeRole.email) {
        return changeRole;
      } else {
        return user;
      }
    });
    setUsers(updatedUser);
  };
  return (
    <>
      <h1> User Roles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            return (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td onClick={() => handleRole(user._id, user.role)}>
                  {user.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
export default userRoles;
