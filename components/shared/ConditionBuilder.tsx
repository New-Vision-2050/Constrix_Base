"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: string;
}

interface Condition {
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

interface ConditionBuilderProps {
  fields: Field[];
  onChange: (conditions: Condition[]) => void;
  initialConditions?: Condition[];
}

const operators = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  date: ['equals', 'before', 'after', 'between'],
  boolean: ['equals'],
  select: ['equals', 'in', 'notIn'],
};

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  fields,
  onChange,
  initialConditions = [],
}) => {
  const [conditions, setConditions] = useState<Condition[]>(initialConditions);

  const getOperatorsForField = (fieldType: string) => {
    switch (fieldType.toLowerCase()) {
      case 'number':
      case 'integer':
      case 'float':
      case 'decimal':
        return operators.number;
      case 'date':
      case 'datetime':
        return operators.date;
      case 'boolean':
        return operators.boolean;
      case 'select':
      case 'enum':
        return operators.select;
      default:
        return operators.text;
    }
  };

  const addCondition = () => {
    const newCondition: Condition = {
      field: fields[0]?.name || '',
      operator: 'equals',
      value: '',
      logicalOperator: conditions.length > 0 ? 'AND' : undefined,
    };
    
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onChange(newConditions);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onChange(newConditions);
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    );
    setConditions(newConditions);
    onChange(newConditions);
  };

  return (
    <div className="space-y-4">
      {conditions.map((condition, index) => {
        const field = fields.find(f => f.name === condition.field);
        const availableOperators = field ? getOperatorsForField(field.type) : [];

        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              {index > 0 && (
                <Select
                  value={condition.logicalOperator}
                  onValueChange={(value: 'AND' | 'OR') => 
                    updateCondition(index, { logicalOperator: value })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(index, { field: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.name} value={field.name}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(index, { operator: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-48">
                <Label className="sr-only" htmlFor={`value-${index}`}>Value</Label>
                <Input
                  id={`value-${index}`}
                  label="Value"
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="Value"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}

      <Button onClick={addCondition} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Condition
      </Button>
    </div>
  );
};