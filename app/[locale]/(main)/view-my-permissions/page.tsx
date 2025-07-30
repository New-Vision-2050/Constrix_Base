import { getPermissions } from "@/lib/permissions/server/get-permissions";
import View from "./view";
async function PublicPage() {
  const cached = await getPermissions();

  return (
    <div className="container" style={{ direction: "ltr" }}>
      For Development purposes only, this page shows the permissions of the
      current user.
      <h1>Permissions</h1>
      <div>
        <View data={cached.map((x) => x.key)} />
      </div>
    </div>
  );
}

export default PublicPage;
