import { baseUrl } from "helpers/baseUrl";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
const Cart = ({ error, products }) => {
  let price = 0;
  const [cartProduct, setCartProduct] = useState(products);
  const { token } = parseCookies();
  if (!token) {
    return (
      <div className="center-align">
        <h3>Please login to view your cart</h3>
        <Link href="/login">
          <button className="btn  #1565c0 blue darken-3">Login</button>
        </Link>
      </div>
    );
  }
  const router = useRouter();
  // console.log("products", products);
  const handleRemove = async (pid) => {
    // console.log("pid", pid);
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        productId: pid,
      }),
    });
    const res2 = await res.json();
    // console.log("res2", res2);
    setCartProduct(res2);
  };
  const handleCheckout = async (paymentInfo) => {
    // console.log("paymentInfo", paymentInfo);
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        paymentInfo: paymentInfo,
      }),
    });
    const paymentResponse = await res.json();
    // console.log("payment response", paymentResponse);
    if (paymentResponse.error) {
      M.toast({ html: paymentResponse.message, classes: "red" });
      router.push("/");
    }
  };
  const TotalPrice = () => {
    return (
      <div>
        <h5> total Rs {price}</h5>
        {products.length != 0 && (
          <StripeCheckout
            name="myStore"
            amount={price * 100}
            image={products.length > 0 ? products[0].productId.mediaUrl : ""}
            currency="PKR"
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            stripeKey="pk_test_51Lk0lVEZxVhqRBsgsUFho3SH5tD0LGVXCekrxh2CyGRRskHjbmpAmLdtksLmi3CXqVYOH0ETMOfKwRW7gfm6Ggys00jFeOOA3t"
            token={(paymentInfo) => handleCheckout(paymentInfo)}
          >
            <button className="btn">Checkout</button>
          </StripeCheckout>
        )}
      </div>
    );
  };
  const CartItems = () => {
    price = 0;
    return (
      <>
        {cartProduct.map((item) => {
          price = price + item.quantity * item.productId.price;
          // console.log("price", price);
          // console.log("item.productId", item.productId);
          return (
            <div style={{ display: "flex", margin: "20px" }} key={item._id}>
              <img src={item.productId.mediaUrl} style={{ width: "30%" }} />
              <div style={{ marginLeft: "20px" }}>
                <h6>{item.productId.name}</h6>
                <h6>
                  {item.quantity} X {item.productId.price}
                </h6>
                <button
                  className="btn red"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  if (error) {
    M.toast({ html: error, classes: "red" });
    Cookies.remove("user");
    Cookies.remove("token");
    router.push("/login");
  }
  return (
    <div
      className="container"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <CartItems />
      <TotalPrice />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    return {
      props: { products: [] },
    };
  }
  // console.log("cart token", token);
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      Authorization: token,
    },
  });
  const products = await res.json();
  // console.log("products error", products.error);
  if (products.error) {
    return {
      props: { error: products.error },
    };
  }
  // console.log("products", products);
  return {
    props: { products },
  };
}
export default Cart;
