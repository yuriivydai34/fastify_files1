async function saveAction(formData: FormData) {
  'use server'
  const file = formData.get('file') as string;
  console.log(file);

  const response = await fetch(
    `${process.env.API_URL}/upload`, 
    {
      method: "POST",
      body: formData
    }
  )

  console.log(response);
}

export default async function Home() {
  const data = await fetch(`${process.env.API_URL}/files`)
  const res = await data.text()

  return (
    <div>
      <p>{res}</p>
      <p>----------------</p>
      <form action={saveAction}>
        <input type="file" name="file" />
        <input type="submit" />
      </form>
    </div>
  );
}
