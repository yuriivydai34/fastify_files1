'use client'

import Link from "next/link";
import { useState, useEffect } from 'react'

export default function FilesList() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)

  const handleDelete = async (id: string) => {
    // API call to delete an item
    console.log(id);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files?id=${id}`, { method: 'DELETE' });
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No files data</p>

  return (
    <table>
      <thead>
        <tr>
          <th>file</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((file: any) => (
          <tr key={file.id}>
            <td>
              {file.name}
            </td>
            <td>
              <Link href={`/filesList/${file.name}`}>Edit</Link>
              <button onClick={() => handleDelete(file.name)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}