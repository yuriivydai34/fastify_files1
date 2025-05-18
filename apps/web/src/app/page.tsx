import FilesList from "./filesList";
import FileUpload from "./fileUpload";

export default async function Home() {
  return (
    <div>
      <FilesList />
      <FileUpload />
    </div>
  );
}
