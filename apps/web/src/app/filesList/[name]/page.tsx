import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const handleDelete = async (data : FormData) => {
    "use server";
    const itemId = data.get("itemId");
    await fetch(`${process.env.API_URL}/files?id=${itemId}`, {method: 'DELETE'});
    redirect(`/`)
  };

  return (
    <div>
      <div>File: {name}</div>
      <div>
        <form action={handleDelete}>
          <input name="itemId" className="hidden" value={name}/>
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  )
}