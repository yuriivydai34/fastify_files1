import FilesList from "./filesList";
import FileUpload from "./fileUpload";
import WsMessages from "./wsMessages";

export default async function Home() {
  return (
    <div>
      <FilesList />
      <FileUpload />
      <WsMessages />
    </div>
  );
}
