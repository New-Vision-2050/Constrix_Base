import { Box, ButtonBase, Switch, Typography } from "@mui/material";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

function HorizontalSwitch({ checked, onChange, label, disabled = false }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        borderRadius: 1,
        width: 1,
        "&:hover": {
          backgroundColor: disabled ? "transparent" : "divider",
        },
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      component={ButtonBase}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <Typography variant="body1" fontWeight={500}>
        {label}
      </Typography>
      <Switch
        checked={checked}
        onChange={(e, checked) => !disabled && onChange(checked)}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled}
      />
    </Box>
  );
}

export default HorizontalSwitch;
