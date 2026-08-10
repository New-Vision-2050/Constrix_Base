"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { PlusIcon } from "lucide-react";
import { useLocale } from "next-intl";
import CustomMenu from "@/components/headless/custom-menu";

const OVERFLOW_BTN_WIDTH = 44;
const DEFAULT_ADD_BTN_WIDTH = 148;
const TAB_GAP = 4;
const HORIZONTAL_PADDING = 24;

const defaultPaperSx: SxProps<Theme> = {
  position: "relative",
  px: 1.5,
  py: 1.5,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 0.5,
  width: "100%",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(12px)",
  backgroundImage: (theme) =>
    `linear-gradient(180deg, ${alpha(
      theme.palette.primary.main,
      0.05,
    )} 0%, transparent 100%)`,
  boxShadow: (theme) => `0 4px 24px ${alpha(theme.palette.common.black, 0.25)}`,
};

const pillIndicatorSx: SxProps<Theme> = {
  position: "absolute",
  inset: 0,
  borderRadius: "12px",
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
  border: "1px solid",
  borderColor: "primary.main",
  boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
  zIndex: 0,
  pointerEvents: "none",
};

export type OverflowTabBarProps<T extends { id: number }> = {
  tabs: T[];
  value: number;
  onChange: (id: number) => void;
  renderLabel: (tab: T, context: "bar" | "menu") => React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  renderAddAction?: (context: "bar" | "menu") => React.ReactNode;
  addActionWidth?: number;
  showAddAction?: boolean;
  paperSx?: SxProps<Theme>;
  overflowTriggerAriaLabel?: string;
};

function useContainerWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => setWidth(element.offsetWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function computeVisibleIndices(
  tabWidths: number[],
  containerWidth: number,
  selectedIndex: number,
  addActionWidth: number,
  hasAddAction: boolean,
): { visibleIndices: number[]; needsOverflow: boolean } {
  if (tabWidths.length === 0) {
    return { visibleIndices: [], needsOverflow: false };
  }

  const sumWidths = (indices: number[]) =>
    indices.reduce((sum, index) => sum + tabWidths[index] + TAB_GAP, 0);

  const addReserve = hasAddAction ? addActionWidth : 0;
  const fitsWithoutOverflow =
    sumWidths(tabWidths.map((_, index) => index)) +
      addReserve +
      HORIZONTAL_PADDING <=
    containerWidth;

  if (fitsWithoutOverflow) {
    return {
      visibleIndices: tabWidths.map((_, index) => index),
      needsOverflow: false,
    };
  }

  const available =
    containerWidth - OVERFLOW_BTN_WIDTH - HORIZONTAL_PADDING - TAB_GAP;

  let visibleCount = 0;
  let used = 0;
  for (let index = 0; index < tabWidths.length; index += 1) {
    const next = used + tabWidths[index];
    if (next > available) break;
    used = next + TAB_GAP;
    visibleCount += 1;
  }

  visibleCount = Math.max(1, visibleCount);

  const visibleSet = new Set<number>();
  if (selectedIndex >= 0) {
    visibleSet.add(selectedIndex);
  }

  for (let index = 0; index < tabWidths.length; index += 1) {
    if (visibleSet.size >= visibleCount) break;
    visibleSet.add(index);
  }

  const visibleIndices = [...visibleSet].sort((a, b) => a - b);

  return { visibleIndices, needsOverflow: true };
}

export default function OverflowTabBar<T extends { id: number }>({
  tabs,
  value,
  onChange,
  renderLabel,
  onAdd,
  addLabel = "Add",
  renderAddAction,
  addActionWidth = DEFAULT_ADD_BTN_WIDTH,
  showAddAction = true,
  paperSx,
  overflowTriggerAriaLabel,
}: OverflowTabBarProps<T>) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const paperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const paperWidth = useContainerWidth(paperRef);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const hasAddAction = showAddAction && Boolean(renderAddAction || onAdd);
  const selectedIndex = tabs.findIndex((tab) => tab.id === value);

  useLayoutEffect(() => {
    const measureNode = measureRef.current;
    if (!measureNode) return;

    const widths = Array.from(measureNode.children).map(
      (child) => (child as HTMLElement).offsetWidth,
    );
    setTabWidths(widths);
  }, [tabs, renderLabel, paperWidth]);

  const { visibleIndices, needsOverflow } = useMemo(
    () =>
      paperWidth > 0
        ? computeVisibleIndices(
            tabWidths,
            paperWidth,
            selectedIndex,
            addActionWidth,
            hasAddAction,
          )
        : {
            visibleIndices: tabs.map((_, index) => index),
            needsOverflow: false,
          },
    [tabWidths, paperWidth, selectedIndex, tabs, addActionWidth, hasAddAction],
  );

  const visibleSet = useMemo(() => new Set(visibleIndices), [visibleIndices]);

  const overflowTabs = useMemo(
    () => tabs.filter((_, index) => !visibleSet.has(index)),
    [tabs, visibleSet],
  );

  const handleTabSelect = useCallback(
    (id: number) => {
      onChange(id);
    },
    [onChange],
  );

  const renderDefaultMenuAddItem = () => (
    <MenuItem
      key="overflow-add-action"
      onClick={onAdd}
      sx={{
        borderRadius: "10px",
        mx: 0.75,
        my: 0.25,
        py: 1.25,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
        <PlusIcon className="h-4 w-4" />
      </ListItemIcon>
      <ListItemText
        primary={addLabel}
        primaryTypographyProps={{
          fontWeight: 700,
          color: "primary.main",
          fontSize: "0.875rem",
        }}
      />
    </MenuItem>
  );

  const renderBarAddAction = () => {
    if (!hasAddAction) return null;
    if (renderAddAction) return renderAddAction("bar");
    return (
      <Button
        variant="contained"
        size="small"
        startIcon={<PlusIcon className="h-4 w-4" />}
        onClick={onAdd}
        aria-label={addLabel}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          px: 2,
          boxShadow: (theme) =>
            `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          flexShrink: 0,
        }}
      >
        {addLabel}
      </Button>
    );
  };

  const renderMenuAddAction = () => {
    if (!hasAddAction) return null;
    if (renderAddAction) return renderAddAction("menu");
    return renderDefaultMenuAddItem();
  };

  const renderTabButton = (tab: T, context: "bar" | "menu") => {
    const isSelected = tab.id === value;

    if (context === "menu") {
      return (
        <MenuItem
          key={tab.id}
          selected={isSelected}
          onClick={() => handleTabSelect(tab.id)}
          sx={{
            borderRadius: "10px",
            mx: 0.75,
            my: 0.25,
            py: 1,
            gap: 1,
          }}
        >
          <ListItemText
            primary={renderLabel(tab, "menu")}
            primaryTypographyProps={{
              component: "div",
              sx: { display: "flex", alignItems: "center" },
            }}
          />
        </MenuItem>
      );
    }

    return (
      <Box
        key={tab.id}
        component="button"
        type="button"
        onClick={() => handleTabSelect(tab.id)}
        sx={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "none",
          cursor: "pointer",
          minHeight: 44,
          px: 2,
          py: 1,
          borderRadius: "12px",
          bgcolor: "transparent",
          color: isSelected ? "primary.main" : "text.secondary",
          fontWeight: isSelected ? 700 : 600,
          fontSize: "0.875rem",
          fontFamily: "inherit",
          transition: "all 0.2s ease",
          zIndex: 1,
          whiteSpace: "nowrap",
          "&:hover": {
            color: "text.primary",
            bgcolor: "rgba(255, 255, 255, 0.03)",
          },
        }}
      >
        {isSelected ? <Box sx={pillIndicatorSx} /> : null}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {renderLabel(tab, "bar")}
        </Box>
      </Box>
    );
  };

  const triggerLabel = overflowTriggerAriaLabel ?? addLabel;
  const overflowCount = overflowTabs.length;
  const menuAnchorHorizontal = isRtl ? "left" : "right";
  const showSideControl = needsOverflow || hasAddAction;

  const withMenuItemKey = (key: string, node: React.ReactNode) => {
    if (!React.isValidElement(node)) return node;
    return React.cloneElement(node, { key });
  };

  const renderMenuContent = () => {
    const items: React.ReactNode[] = [];

    const addItem = renderMenuAddAction();
    if (addItem) {
      items.push(withMenuItemKey("overflow-add-action", addItem));
    }

    if (overflowCount > 0) {
      if (hasAddAction && addItem) {
        items.push(<Divider key="overflow-divider" sx={{ mx: 1, my: 0.5 }} />);
      }
      overflowTabs.forEach((tab) => {
        items.push(renderTabButton(tab, "menu"));
      });
    }

    return items;
  };

  const renderOverflowTrigger = (
    onClick: (e: React.MouseEvent<HTMLElement>) => void,
  ) => (
    <Badge
      badgeContent={overflowCount || undefined}
      color="primary"
      overlap="circular"
      sx={{
        flexShrink: 0,
        "& .MuiBadge-badge": {
          fontSize: "0.65rem",
          height: 16,
          minWidth: 16,
          fontWeight: 700,
          top: 4,
          ...(isRtl ? { right: 4 } : { left: 4 }),
        },
      }}
    >
      <IconButton
        onClick={onClick}
        aria-label={triggerLabel}
        sx={{
          width: OVERFLOW_BTN_WIDTH,
          height: OVERFLOW_BTN_WIDTH,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
            boxShadow: (theme) =>
              `0 4px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
        }}
      >
        <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
      </IconButton>
    </Badge>
  );

  const renderSideControl = () => {
    if (needsOverflow) {
      return (
        <CustomMenu
          menuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: menuAnchorHorizontal,
            },
            transformOrigin: {
              vertical: "top",
              horizontal: menuAnchorHorizontal,
            },
            slotProps: {
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 240,
                  maxWidth: 320,
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.96),
                  backdropFilter: "blur(16px)",
                  boxShadow: (theme) =>
                    `0 12px 40px ${alpha(theme.palette.common.black, 0.28)}`,
                  py: 0.75,
                },
              },
            },
          }}
          renderAnchor={({ onClick }) => renderOverflowTrigger(onClick)}
        >
          {renderMenuContent()}
        </CustomMenu>
      );
    }

    if (hasAddAction) {
      return renderBarAddAction();
    }

    return null;
  };

  const tabsRow = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
        minWidth: 0,
        gap: `${TAB_GAP}px`,
        overflow: "hidden",
      }}
    >
      {tabs
        .filter((_, index) => visibleSet.has(index))
        .map((tab) => renderTabButton(tab, "bar"))}
    </Box>
  );

  const sideControlRow = showSideControl ? (
    <Box sx={{ flexShrink: 0 }}>{renderSideControl()}</Box>
  ) : null;

  return (
    <Paper
      ref={paperRef}
      elevation={0}
      sx={
        paperSx
          ? ([defaultPaperSx, paperSx] as SxProps<Theme>)
          : defaultPaperSx
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          minWidth: 0,
          gap: 0.5,
          direction: "ltr",
        }}
      >
        {tabsRow}
        {sideControlRow}
      </Box>

      <Box
        ref={measureRef}
        aria-hidden
        sx={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "row",
          gap: `${TAB_GAP}px`,
          height: 0,
          overflow: "hidden",
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.id}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
              px: 2,
              py: 1,
              fontSize: "0.875rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {renderLabel(tab, "bar")}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
