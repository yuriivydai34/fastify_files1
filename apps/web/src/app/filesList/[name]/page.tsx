'use client'

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  function deleteFile() {
    console.log('delete file: ', name);
  }

  return (
    <div>
      <div>File: {name}</div>
      <button onClick={deleteFile}>Delete</button>
    </div>
  )
}