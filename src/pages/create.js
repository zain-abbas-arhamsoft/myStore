import { baseUrl } from "helpers/baseUrl";
import Link from "next/link";
import { useState } from "react";
import { parseCookies } from "nookies";
const create = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await imageUpload();
    // console.log(name, price, description, mediaUrl);
    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("mediaUrl", mediaUrl);
    const response = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        description,
        mediaUrl: url,
      }),
    });
    // console.log("add product", response);
    const data = await response.json();
    // console.log("data error", data.error);
    if (data.error) {
      // console.log("throw error");
      M.toast({ html: data.error, classes: "red" });
    } else {
      M.toast({ html: "Product Saved", classes: "green" });
    }
  };

  const imageUpload = async () => {
    const data = new FormData();
    data.append("file", mediaUrl);
    data.append("upload_preset", "myStore");
    data.append("cloud_name", "dkqr1pdbt");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkqr1pdbt/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const imageUploaded = await res.json();
    // console.log("imageUploaded", imageUploaded);
    return imageUploaded.url;
  };
  return (
    <form className="container" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <div className="file-field input-field">
        <div className="btn #1565c0 blue darken-3">
          <span>File</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMediaUrl(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <img
        className="responsive-img"
        src={mediaUrl ? URL.createObjectURL(mediaUrl) : ""}
      />
      <textarea
        name="description"
        id="textarea1"
        className="materialize-textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button
        className="btn waves-effect waves-light #1565c0 blue darken-3"
        type="submit"
        name="action"
      >
        Submit
        <i className="material-icons right">send</i>
      </button>
    </form>
  );
};
export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);
  // console.log("cookie", cookie);
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  // console.log("user", user);
  if (user.role !== "admin" || user.role !== "root") {
    const { res } = ctx;
    res.writeHead(302, { location: "/" });
    res.end();
  }
  return {
    props: {},
  };
}
export default create;
