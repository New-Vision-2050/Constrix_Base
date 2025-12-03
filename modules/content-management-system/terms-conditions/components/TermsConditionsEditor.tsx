import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import WysiwygEditor from "@/components/headless/wysiwyg/base";
import { Control } from "react-hook-form";
import { TermsConditionsFormData } from "../schema/terms-conditions-form.schema";

/**
 * Terms and Conditions Editor Component
 * 
 * Renders the WYSIWYG editor for terms and conditions content
 * Follows Single Responsibility Principle - only handles editor rendering
 * Supports rich text editing with formatting options
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
              <WysiwygEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={placeholder}
                minHeight={400}
                maxHeight={800}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

