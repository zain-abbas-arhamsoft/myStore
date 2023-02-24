import { parseCookies } from "nookies";
import { baseUrl } from "helpers/baseUrl";
import { useEffect, useRef } from "react";
import UserRoles from "components/userRoles";
const Account = ({ orders }) => {
  // console.log("orders", orders);
  const orderCard = useRef(null);
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  // console.log("user account", user);

  useEffect(() => {
    M.Collapsible.init(orderCard.current);
  }, []);
  const OrderHistory = () => {
    return (
      <ul class="collapsible" ref={orderCard}>
        {orders.map((item) => {
          return (
            <li key={item._id}>
              <div className="collapsible-header">
                <i className="material-icons">folder</i>
                {item.createdAt}
              </div>
              <div className="collapsible-body">
                <h4>Total {item.total}</h4>
                {item.products.map((element) => {
                  return (
                    <h6 key={element._id}>
                      {element.quantity}X{element.productId.price}
                    </h6>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <>
      <div className="container">
        <div
          className="center-align white-text"
          style={{
            marginTop: "10px",
            backgroundColor: "#1565c0",
            padding: "10px",
          }}
        ></div>
        <h3> Order History</h3>
        {orders.length == 0 ? (
          <div className="container center-align">
            <h3>You have no order history</h3>
          </div>
        ) : (
          <OrderHistory />
        )}
        {user.role == "admin" && <UserRoles /> }
      </div>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  // console.log("token account...", token);
  // console.log("token typeof", typeof token);
  if (!token) {
    const { res } = ctx;
    res.writeHead(302, { location: "/login" });
    res.end();
  }
  const res = await fetch(`${baseUrl}/api/orders`, {
    headers: {
      Authorization: token,
    },
  });
  const orders = await res.json();
  // console.log("orders", orders);
  return {
    props: { orders: orders },
  };
}
export default Account;
