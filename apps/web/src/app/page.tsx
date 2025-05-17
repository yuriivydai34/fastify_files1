export default async function Home() {
  const data = await fetch(`${process.env.API_URL}/ping`)
  const res = await data.text()
  return (
    <div><p>{res}</p></div>
  );
}
