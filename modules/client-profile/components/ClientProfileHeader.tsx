"use client";
import { ClientProfileData } from "@/app/[locale]/(main)/client-profile/[id]/types";
import UserProfileHeader, { ProfileSubItem } from "@/components/shared/profile-header";
import { Mail, Phone } from "lucide-react";


type PropsT = {
    profileData: ClientProfileData;
}


export default function ClientProfileHeader({ profileData }: PropsT) {

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
    />
}