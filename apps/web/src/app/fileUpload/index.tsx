import { redirect } from "next/navigation";

async function saveAction(formData: FormData) {
  'use server'
  const file = formData.get('file') as string;

  const response = await fetch(
    `${process.env.API_URL}/files`,
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
        <input type="submit" />
      </form>
    </div>
  );
}