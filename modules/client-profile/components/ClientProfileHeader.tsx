"use client";
import { ClientProfileData } from "@/app/[locale]/(main)/client-profile/[id]/types";
import UserProfileHeader, { ProfileSubItem } from "@/components/shared/profile-header";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import ProfileRoleSelector from "./ProfileRoleSelector";

type PropsT = {
    profileData: ClientProfileData;
    readonly: boolean;
}

export default function ClientProfileHeader({ profileData, readonly }: PropsT) {
    // Translations
    const t = useTranslations("ClientProfile");
    
    // user types
    const userTypes = profileData?.user_types ?? [];

    // sub items
    const subItems: ProfileSubItem[] = [
        {
            icon: <Mail />,
            value: profileData.email ?? ''
        },
        {
            icon: <Phone />,
            value: profileData.phone ?? '',
        },
    ];

    return <UserProfileHeader
        imgSrc={''}
        loading={false}
        name={profileData.name ?? ''}
        subItems={subItems}
        job_title={'programmer'}
        address={'address'}
        date_appointment={'date_appointment'}
        setOpenUploadImgDialog={() => { }}
        actionSlot={userTypes.length > 0 ? <ProfileRoleSelector id={profileData.id} userTypes={userTypes} readonly={readonly} /> : undefined}
    />
}