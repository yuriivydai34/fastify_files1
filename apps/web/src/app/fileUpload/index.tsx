import { redirect } from "next/navigation";

async function saveAction(formData: FormData) {
  'use server'
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files`,
    {
      method: "POST",
      body: formData
    }
  )

  redirect(`/`)
}

export default async function FileUpload() {
  return (
    <div>
      <form action={saveAction}>
        <input type="file" name="file" />
        <input className="btn btn-green" type="submit" />
      </form>
    </div>
  );
}