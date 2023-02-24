import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import { baseUrl } from "helpers/baseUrl";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const modalref = useRef(null);
  const cookie = parseCookies();
  // console.log("cookieUser parse", cookie);
  // console.log("JSON parse", cookie.user);
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  // console.log("final user", user);
  // console.log("specific cookie", cookie);
  // console.log("getStatic props product", product);

  const addToCart = async () => {
    const token = cookie.token;
    // console.log("token", token);
    // console.log("quantity", quantity);
    // console.log("productId", product._id);
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        quantity,
        productId: product._id,
      }),
    });

    const getCartProducts = await res.json();
    // console.log("getCartProducts", getCartProducts);
    if (getCartProducts.error) {
      M.toast({ html: getCartProducts.message, classes: "red" });
      Cookies.remove("token");
      Cookies.remove("user");
      router.push("/login");
    } else {
      M.toast({ html: getCartProducts.message, classes: "green" });
    }
  };
  useEffect(() => {
    M.Modal.init(modalref.current);
  }, []);
  if (router.isFallback) {
    // console.log("load");
    return <h3>Loading...</h3>;
  }
  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: "DELETE",
    });
    await res.json();
    router.push("/");
  };
  const getModal = () => {
    return (
      <div id="modal1" className="modal" ref={modalref}>
        <div className="modal-content">
          <h4>{product.name}</h4>
          <p>Are you sure you want to delete this</p>
        </div>
        <div className="modal-footer">
          <button className="btn waves-effect waves-light #1565c0 blue darken-3">
            Cancel
          </button>
          <button
            className="btn waves-effect waves-light #c62828 red darken-3"
            onClick={() => deleteProduct()}
          >
            Yes
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="container center-align">
      <h1>{product.name}</h1>
      <img src={product.mediaUrl} style={{ width: "30%" }} />
      <h5>{product.price}</h5>
      <input
        type="number"
        style={{ width: "400px", margin: "10px" }}
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
      />
      {user ? (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => addToCart()}
        >
          Add
          <i className="material-icons right">add</i>
        </button>
      ) : (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => router.push("/login")}
        >
          Login to add
          <i className="material-icons right">add</i>
        </button>
      )}

      <p className="left-align">{product.description}</p>
      {user && user.role !== "user" && (
        <button
          data-target="modal1"
          className="btn modal-trigger waves-effect waves-light #c62828 red darken-3"
        >
          Delete
          <i className="material-icons left">delete</i>
        </button>
      )}

      {getModal()}
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`http://localhost:3000/api/product/${id}`);
  const data = await res.json();
  return {
    props: { product: data },
  };
}

// export async function getStaticProps({ params: { id } }) {
//   const res = await fetch(`${baseUrl}/api/product/${id}`);
//   const data = await res.json();
//   console.log("getStatic props data", data);
//   return {
//     props: { product: data },
//   };
// }

// export async function getStaticPaths() {
//   return {
//     paths: [
//       {
//         params: {
//           id: "63eb3486cc4239f3f7c4d3b3",
//         },
//       },
//     ],
//     fallback: true,
//   };
// }
export default Product;
