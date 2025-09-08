"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/modules/table/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import type { CreateProductFormData } from "../schema";

interface VATTableProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function VATTable({ form }: VATTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "taxes",
  });

  const addTax = () => {
    append({
      country_id: 1,
      tax_number: "",
      tax_percentage: "0",
      is_active: 1,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground text-xl font-medium">
          إعدادات القيمة المضافة
        </h3>
        <Button type="button" onClick={addTax}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-4 text-gray-400 font-medium">
                رقم الدولة
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                الرقم الضريبي
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                نسبة الضريبة
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                تفعيل
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="border-b">
                <td className="p-4">
                  <FormField
                    control={form.control}
                    name={`taxes.${index}.country_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </td>
                <td className="p-4">
                  <FormField
                    control={form.control}
                    name={`taxes.${index}.tax_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="VAT12345" {...field} />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </td>
                <td className="p-4">
                  <FormField
                    control={form.control}
                    name={`taxes.${index}.tax_percentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="5.00"
                            {...field}
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </td>
                <td className="p-4">
                  <FormField
                    control={form.control}
                    name={`taxes.${index}.is_active`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value === 1}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? 1 : 0)
                            }
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </td>
                <td className="p-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  لا توجد ضرائب مضافة. انقر على &quot;إضافة&quot; لإضافة ضريبة
                  جديدة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
