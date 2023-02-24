import Link from "next/link";
import { baseUrl } from "helpers/baseUrl";
const home = ({ products }) => {

  const productList = products.map((product) => {
    return (
      <div className="card pcard" key={product._id}>
        <div className="card-image">
          <img src={product.mediaUrl} />
          <span className="card-title">{product.name}</span>
        </div>

        <div className="card-content">
          <p>RS {product.price}</p>
        </div>
        <div className="card-action"></div>
        <Link href={'/product/[id]'} as={`/product/${product._id}`}>View Product</Link>
      </div>
    );
  });
  // console.log("products", products);
  return (
    <div className="rootcard">
      {productList}
      {/* <h1> next js is awesome</h1>
      <h2>hey</h2>
      <Link href="/product">Go to Product Page</Link> */}
      {/* <style jsx>
        {`
          h1 {
            color: red;
          }
        `}
      </style> */}
    </div>
  );
};

// get static props and get server side props both are used for data fetching
// export async function getStaticProps() {
//   const response = await fetch(`${baseUrl}/api/products`);
//   const data = await response.json();
//   console.log("data", data);
//   return {
//     props: {
//       products: data,
//     },
//   };
// }

export async function getServerSideProps() {
  const response = await fetch(`${baseUrl}/api/products`);
  const data = await response.json();
  // console.log("data", data);
  return {
    props: {
      products: data,
    },
  };
}
export default home;
