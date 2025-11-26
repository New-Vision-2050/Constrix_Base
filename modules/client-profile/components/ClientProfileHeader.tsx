"use client";
import { ClientProfileData, UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import UserProfileHeader, { ProfileSubItem } from "@/components/shared/profile-header";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Button } from "@mui/material";
import { MoreVert, Person, Business, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type PropsT = {
    profileData: ClientProfileData;
}

export default function ClientProfileHeader({ profileData }: PropsT) {
    // Translations
    const t = useTranslations("ClientProfile");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    // user types
    const userTypes = profileData?.user_types ?? [];
    // current role
    const [profileRole, setProfileRole] = useState(userTypes[0]?.role ?? '');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (action: UserRoleType) => {
        // navigate to the user type profile
        // router.push(`/client-profile/${profileData.id}?role=${action.role}`);
        setProfileRole(action.role);
        handleClose();
    };

    
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

    // action slot - MUI Dropdown Menu
    const actionSlot = (
        <>
            <Button
                onClick={handleClick}
                variant="outlined"
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                startIcon={<Person fontSize="small" />}
                endIcon={<MoreVert />}
            >
                {profileRole == '1' ? t("header.userTypes.client") : profileRole == '2' ? t("header.userTypes.broker") : t("header.userTypes.employee")}
            </Button>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'user-menu-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {userTypes.map((userType) => (
                    <MenuItem key={userType.id} disabled={profileRole == userType.role} onClick={() => handleMenuItemClick(userType)}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{userType.role == '1' ? t("header.userTypes.client") : userType.role == '2' ? t("header.userTypes.broker") : t("header.userTypes.employee")}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );

    return <UserProfileHeader
        imgSrc={''}
        loading={false}
        name={profileData.name ?? ''}
        subItems={subItems}
        job_title={'programmer'}
        address={'address'}
        date_appointment={'date_appointment'}
        setOpenUploadImgDialog={() => { }}
        actionSlot={userTypes.length > 0 ? actionSlot : undefined}
    />
}