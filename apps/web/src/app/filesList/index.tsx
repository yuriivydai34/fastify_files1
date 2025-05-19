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

    // delete the file, and reload list
    setData(data => data.filter((f) => f.name !== id));
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
    <table className="border-collapse border border-gray-400">
      <thead>
        <tr>
          <th className="border border-gray-300">file</th>
          <th className="border border-gray-300">actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((file: any) => (
          <tr key={file.id}>
            <td className="border border-gray-300">
              {file.name}
            </td>
            <td className="border border-gray-300">
              <Link className="btn btn-blue" href={`/filesList/${file.name}`}>Edit</Link>
              <button className="btn btn-red" onClick={() => handleDelete(file.name)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}