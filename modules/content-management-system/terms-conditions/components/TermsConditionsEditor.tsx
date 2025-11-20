import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import RichTextEditor from "@/modules/stores/terms/components/RichTextEditor";
import { Control } from "react-hook-form";
import { TermsConditionsFormData } from "../schema/terms-conditions-form.schema";

/**
 * Terms and Conditions Editor Component
 * 
 * Renders the rich text editor for terms and conditions content
 * Follows Single Responsibility Principle - only handles editor rendering
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
    <div className="bg-sidebar rounded-lg p-6 space-y-6">
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={placeholder}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

