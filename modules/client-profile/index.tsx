import { ClientProfileData } from "@/app/[locale]/(main)/client-profile/[id]/types";

type PropsT = {
    profileData: ClientProfileData;
}

export default function ClientProfileModule({ profileData }: PropsT) {
    return (
        <div className="px-6 py-4">
            <h1>Client Profile Page</h1>
            <p>User ID: {profileData.id}</p>
        </div>
    );
}