import { Button } from "@/components/ui/button";
import LightIcon from "@/public/icons/light";

const ToggleTheme = () => {
  return (
    <Button size={"icon"} variant={'ghost'}>
      <LightIcon />
    </Button>
  );
};

export default ToggleTheme;
