import User from "models/User";
import Authenticated from "helpers/Authenticated";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await fetchUsers(req, res);
      break;
    case "PUT":
      await changeRole(req, res);
      break;
  }
};

const fetchUsers = Authenticated(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select(
    "password"
  );
//   console.log("users", users);
  res.status(200).json(users);
});

const changeRole = Authenticated(async (req, res) => {
  const { _id, role } = req.body;
//   console.log("role..", role);
  const newRole = role == "user" ? "admin" : "user";
//   console.log("newRole", newRole);
  const users = await User.findOneAndUpdate(
    { _id },
    { role: newRole },
    { new: true }
  ).select("password");
//   console.log("user change role", users);
  res.status(200).json(users);
});
