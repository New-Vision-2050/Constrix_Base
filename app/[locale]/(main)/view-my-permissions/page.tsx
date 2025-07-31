import { getPermissions } from "@/lib/permissions/server/get-permissions";
import View from "./view";
import { getCurrentHost } from "@/utils/get-current-host";
async function PublicPage() {
  const cached = await getPermissions();
  const host = await getCurrentHost();
  return (
    <div className="container" style={{ direction: "ltr" }}>
      For Development purposes only, this page shows the permissions of the
      current user.
      <div>
        <strong>Current Host:</strong> {host || "Not available"}
      </div>
      <h1>Permissions</h1>
      <div>
        <View
          data={{
            ...cached,
            permissions: cached.permissions.map((x) => x.key),
          }}
        />
      </div>
    </div>
  );
}

export default PublicPage;
