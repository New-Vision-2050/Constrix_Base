import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Control } from "react-hook-form";
import { TermsConditionsFormData } from "../schema/terms-conditions-form.schema";

/**
 * Terms and Conditions Editor Component
 * 
 * Renders the textarea editor for terms and conditions content
 * Follows Single Responsibility Principle - only handles editor rendering
 * Supports both dark and light modes with appropriate styling
 * 
 * @param control - React Hook Form control
 * @param placeholder - Placeholder text for the editor
 */
interface TermsConditionsEditorProps {
  control: Control<TermsConditionsFormData>;
  placeholder: string;
}

export default function TermsConditionsEditor({
  control,
  placeholder,
}: TermsConditionsEditorProps) {
  return (
    <div className="bg-sidebar dark:bg-sidebar rounded-lg p-6 space-y-6">
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={placeholder}
                rows={12}
                className="resize-none bg-white dark:bg-sidebar border-gray-300 dark:border-white text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

