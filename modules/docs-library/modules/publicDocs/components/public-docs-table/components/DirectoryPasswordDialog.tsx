import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoIcon from "@/public/icons/info";
import { useTranslations } from "next-intl";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { apiClient } from "@/config/axios-config";

interface PropsI {
  open: boolean;
  onClose: () => void;
}

export default function DirectoryPasswordDialog({ open, onClose }: PropsI) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const t = useTranslations("docs-library.publicDocs.directoryPasswordDialog");
  const {
    branchId,
    docs,
    setDirPassword,
    setParentId,
    tempParentId,
    setVisitedDirs,
  } = usePublicDocsCxt();

  const isPasswordRight = async () => {
    try {
      await apiClient.get(`/folders/contents`, {
        params: {
          // folder parent id
          parent_id: tempParentId,
          branch_id: branchId == "all" ? undefined : branchId,
          password: password?.length ? password : undefined,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  const handleConfirm = async () => {
    if (!password.trim()) return;

    const document = docs?.folders?.find((doc) => doc.id == tempParentId);

    if (!document) return;

    setIsLoading(true);
    setErrorMsg("");
    try {
      const check = await isPasswordRight();
      if (!check) {
        setErrorMsg("invalid password,try again");
        return;
      }
      setVisitedDirs((prev) => [...prev, document]);
      React.startTransition(() => {
        setDirPassword(password);
        setParentId(tempParentId);
      });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error("Password verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-4">
          <DialogTitle asChild>
            <div>
              <button
                className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
                onClick={onClose}
              >
                ✕
              </button>
              <h2 className="text-center !text-xl mt-4">{t("title")}</h2>
            </div>
          </DialogTitle>
          <InfoIcon />
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {t("description")}
            </p>
            <div className="space-y-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && password.trim()) {
                    handleConfirm();
                  }
                }}
                disabled={isLoading}
              />
            </div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          </div>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3">
          <Button
            onClick={handleConfirm}
            className="w-32 h-10"
            loading={isLoading}
            disabled={!password.trim() || isLoading}
          >
            {t("confirm")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-10"
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
