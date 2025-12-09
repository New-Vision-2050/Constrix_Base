"use client";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { useMemo, useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { MoreVert, Person } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { UsersRole } from "@/constants/users-role.enum";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PropsT = {
    id: number | string;
    userTypes: UserRoleType[];
    readonly: boolean;
}

export default function ProfileRoleSelector({ id, userTypes, readonly }: PropsT) {
    // Translations
    const t = useTranslations("ClientProfile");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // get role from query params
    const searchParams = useSearchParams();
    const role = searchParams.get('role') ?? '2';

    // current role
    const defaultRole = useMemo(() => {
        return readonly ? UsersRole.Employee : role == '2' ? UsersRole.Client : UsersRole.Broker;
    }, [readonly, role]);
    const [profileRole, setProfileRole] = useState<string | null>(defaultRole);
    console.log('defaultRole', defaultRole, role, profileRole);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (action: UserRoleType) => {
        setProfileRole(action.role);
        handleClose();
    };

    return (
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
                {profileRole == UsersRole?.Client ? t("header.userTypes.client") : profileRole == UsersRole?.Broker ? t("header.userTypes.broker") : t("header.userTypes.employee")}
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
                {!readonly && userTypes?.length > 0 && userTypes.map((userType) => (
                    <MenuItem
                        component={Link}
                        href={userType.role == UsersRole.Employee ? `/user-profile?id=${id}` : `/client-profile/${id}?role=${userType.role}`}
                        key={userType.id}
                        disabled={profileRole == userType.role}
                        onClick={() => handleMenuItemClick(userType)}
                    >
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{userType.role == UsersRole.Client ? t("header.userTypes.client") : userType.role == UsersRole.Broker ? t("header.userTypes.broker") : t("header.userTypes.employee")}</ListItemText>
                    </MenuItem>
                ))}
                {readonly && (
                    <MenuItem disabled>
                        <ListItemText>{t("header.userTypes.employee")}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

