export default async function FilesList() {
  const data = await fetch(`${process.env.API_URL}/files`)
  const files = await data.json()
  return (
    <table>
      <thead>
        <tr>
          <th>file</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file: any) => (
          <tr key={file.id}>
            <td>
              {file.name}
            </td>
            <td>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}