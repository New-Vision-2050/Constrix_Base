"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Stack,
  Chip,
} from "@mui/material";
import { ChevronDown, Shield } from "lucide-react";
import { useProjectRolesTranslations } from "../useProjectRolesTranslations";
import { ProjectPermissionsData } from "@/services/api/projects/permissions/types/response";

interface RolePermissionsDialogProps {
  open: boolean;
  onClose: () => void;
  permissionsData?: ProjectPermissionsData;
}

export default function RolePermissionsDialog({
  open,
  onClose,
  permissionsData,
}: RolePermissionsDialogProps) {
  const t = useProjectRolesTranslations();

  const permissionGroups = useMemo(() => {
    if (!permissionsData?.permissions) return {};

    const groups: Record<
      string,
      Record<string, { id: string; name: string; type: string; key: string }[]>
    > = {};

    Object.entries(permissionsData.permissions).forEach(
      ([category, subcategories]) => {
        groups[category] = {};
        Object.entries(subcategories).forEach(
          ([subcategory, permissionList]) => {
            groups[category][subcategory] = permissionList.map((perm) => ({
              id: perm.id,
              name: perm.name,
              type: perm.type,
              key: perm.key,
            }));
          }
        );
      }
    );

    return groups;
  }, [permissionsData]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Set<string>
  >(new Set());

  const handleCategoryToggle = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
      Object.keys(permissionGroups[category] || {}).forEach((subcat) => {
        expandedSubcategories.delete(`${category}.${subcat}`);
      });
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubcategoryToggle = (category: string, subcategory: string) => {
    const key = `${category}.${subcategory}`;
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubcategories(newExpanded);
  };

  const getCategoryPermissionCount = (category: string) => {
    const subcategories = permissionGroups[category] || {};
    return Object.values(subcategories).reduce(
      (total, perms) => total + perms.length,
      0
    );
  };

  const getSubcategoryPermissionCount = (
    category: string,
    subcategory: string
  ) => {
    return (permissionGroups[category]?.[subcategory] || []).length;
  };

  if (!permissionsData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Shield className="h-6 w-6" />
          <Box>
            <Typography variant="h6">{t("rolePermissions")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("role")}: {permissionsData.role.name}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("totalPermissions")}: {permissionsData.permissions_count}
          </Typography>
        </Box>

        <Stack spacing={1}>
          {Object.entries(permissionGroups).map(
            ([category, subcategories]) => {
              const isCategoryExpanded = expandedCategories.has(category);
              const categoryCount = getCategoryPermissionCount(category);

              return (
                <Box key={category}>
                  <Accordion
                    expanded={isCategoryExpanded}
                    onChange={() => handleCategoryToggle(category)}
                    sx={{
                      boxShadow: 1,
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown className="h-5 w-5" />}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ flex: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {category}
                        </Typography>
                        <Chip
                          label={`${categoryCount} ${t("permissions")}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "inherit",
                          }}
                        />
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                      <Stack spacing={0.5}>
                        {Object.entries(subcategories).map(
                          ([subcategory, permissions]) => {
                            const subKey = `${category}.${subcategory}`;
                            const isSubExpanded =
                              expandedSubcategories.has(subKey);
                            const subCount =
                              getSubcategoryPermissionCount(
                                category,
                                subcategory
                              );

                            return (
                              <Box key={subKey}>
                                <Accordion
                                  expanded={isSubExpanded}
                                  onChange={() =>
                                    handleSubcategoryToggle(
                                      category,
                                      subcategory
                                    )
                                  }
                                  sx={{
                                    boxShadow: "none",
                                    "&:before": { display: "none" },
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={
                                      <ChevronDown className="h-4 w-4" />
                                    }
                                    sx={{
                                      bgcolor: "grey.100",
                                      minHeight: 48,
                                      "&.Mui-expanded": {
                                        minHeight: 48,
                                      },
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Typography variant="body1" fontWeight={500}>
                                        {subcategory}
                                      </Typography>
                                      <Chip
                                        label={`${subCount}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Stack>
                                  </AccordionSummary>

                                  <AccordionDetails sx={{ pl: 4, pt: 2 }}>
                                    <Stack spacing={1}>
                                      {permissions.map((permission) => (
                                        <Box
                                          key={permission.id}
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1,
                                            borderRadius: 1,
                                            "&:hover": {
                                              bgcolor: "grey.50",
                                            },
                                          }}
                                        >
                                          <FormControlLabel
                                            control={
                                              <Checkbox checked disabled />
                                            }
                                            label={
                                              <Box>
                                                <Typography variant="body2">
                                                  {permission.name}
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  color="text.secondary"
                                                  sx={{
                                                    fontFamily: "monospace",
                                                  }}
                                                >
                                                  {permission.key}
                                                </Typography>
                                              </Box>
                                            }
                                          />
                                          <Chip
                                            label={permission.type}
                                            size="small"
                                            color={
                                              permission.type === "view"
                                                ? "info"
                                                : permission.type === "create"
                                                ? "success"
                                                : permission.type === "edit"
                                                ? "warning"
                                                : permission.type === "delete"
                                                ? "error"
                                                : "default"
                                            }
                                          />
                                        </Box>
                                      ))}
                                    </Stack>
                                  </AccordionDetails>
                                </Accordion>
                              </Box>
                            );
                          }
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            }
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
