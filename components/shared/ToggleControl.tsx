import { useState } from "react";
import { Label } from "@/components/ui/label";


export default function ToggleControl({
  activeLabel,
  inactiveLabel,
  disabled,
  checked,
  onChange,
}: {
  activeLabel: string;
  inactiveLabel: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  // checked state
  const [checkedState, setCheckedState] = useState(checked);
  
  
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={`switcher-controller`} className="font-normal">
        {checkedState ? activeLabel : inactiveLabel}
      </Label>
      <label className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <input
          defaultChecked={checked}
          onChange={(e) => {
            setCheckedState(e.target.checked);
            onChange(e.target.checked);
          }}
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 
           peer-focus:ring-pink-300 rounded-full peer dark:bg-gray-700 
           peer-checked:after:translate-x-full peer-checked:after:border-white 
           after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
           after:bg-white after:border-gray-300 after:border after:rounded-full 
           after:h-5 after:w-5 after:transition-all dark:border-gray-600 
           peer-checked:bg-pink-600 relative
           ${disabled ? 'pointer-events-none' : ''}`}
        ></div>
      </label>
    </div>
  );
}
