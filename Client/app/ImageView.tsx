
export default function ImageView({ id = 1 }) {
  const url = `http://localhost:5000/image?id=${id}`;

  return (
    <div>
      <img className="ImageViewImage" src={url} />
      <p>{id}</p>
    </div>
  );
}
