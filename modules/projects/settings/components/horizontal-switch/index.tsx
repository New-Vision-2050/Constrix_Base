import { Box, ButtonBase, Switch, Typography } from "@mui/material";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

function HorizontalSwitch({ checked, onChange, label }: Props) {
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
          backgroundColor: "divider",
        },
      }}
      component={ButtonBase}
      onClick={() => onChange(!checked)}
    >
      <Typography variant="body1" fontWeight={500}>
        {label}
      </Typography>
      <Switch
        checked={checked}
        onChange={(e, checked) => onChange(checked)}
        onClick={(e) => e.stopPropagation()}
      />
    </Box>
  );
}

export default HorizontalSwitch;
