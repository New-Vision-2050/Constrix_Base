import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTER } from "@/router";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import { UserTableRow } from "@/modules/table/utils/configs/usersTableConfig";
import useCurrentAuthCompany from "@/hooks/use-auth-company";

interface PropsT {
  open: boolean;
  onClose: () => void;
  user: UserTableRow;
}

const ChooseUserCompany: React.FC<PropsT> = ({ open, onClose, user }) => {
  // declare and define vars and state
  const router = useRouter();
  const { data: authCompanyData, isLoading } = useCurrentAuthCompany();
  // handle redirect to user profile page if user has one company
  useEffect(() => {
    const authCompany = authCompanyData?.payload;
    if (open && authCompany) {
      if (!Boolean(authCompany?.is_central_company)) {
        const company = user.companies[0];
        const userId = company?.users?.[0]?.id ?? "";
        router.push(
          `${ROUTER.USER_PROFILE}?id=${userId}&company_id=${authCompany?.id}`
        );
        onClose();
      } else if (
        user?.companies?.length === 1 &&
        user?.companies[0]?.users?.length
      ) {
        const company = user.companies[0];
        const userId = company?.users?.[0]?.id ?? "";
        router.push(
          `${ROUTER.USER_PROFILE}?id=${userId}&company_id=${company?.id}`
        );
        onClose();
      }
    }
  }, [open, user, router, onClose, authCompanyData]);

  // declare and define functions
  const handleRedirect = (id: string, companyId: string) => {
    if (!id) return;
    router.push(`${ROUTER.USER_PROFILE}?id=${id}&company_id=${companyId}`);
  };

  if (isLoading) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-9">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
            <p className="text-lg font-bold">برجاء أختيار الشركة</p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex gap-6 items-center justify-center flex-wrap">
            {user?.companies?.map((company) => (
              <div
                key={company?.id}
                onClick={() =>
                  handleRedirect(
                    company?.users?.[0]?.id ?? "",
                    company?.id ?? ""
                  )
                }
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <img
                  title={company?.name}
                  src={company?.logo ?? LogoPlaceholder.src}
                  width={70}
                  height={70}
                  className="rounded-2xl"
                />
                <p className="text-sm font-semibold">{company?.name}</p>
              </div>
            ))}
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-32 h-10">
            الغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseUserCompany;
