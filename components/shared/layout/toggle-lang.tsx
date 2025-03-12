import { Button } from "@/components/ui/button";
import LangIcon from "@/public/icons/lang";

const ToggleLang = () => {
  return (
    <Button size={"icon"} variant={'ghost'}>
      <LangIcon />
    </Button>
  );
};

export default ToggleLang;
