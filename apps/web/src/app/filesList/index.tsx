async function handleClick() {
  console.log('delete!!!');
}

export default async function FilesList() {
  const data = await fetch(`${process.env.API_URL}/files`)
  const res = await data.text()

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>file</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>file_name</td>
            <td>
              <input type="button" value="Delete" />
            </td>
          </tr>
        </tbody>
      </table>
      <p>{res}</p>
    </div>
  );
}