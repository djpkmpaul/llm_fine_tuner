import React from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Int32 } from 'mongoose';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step = 1 }) => (
  <div className="m-2 p-2 space-y-2">
    <Label className="text-base font-medium text-gray-700">{label}</Label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
  </div>
);

interface SelectInputProps {
  label: string;
  value: string | number ;
  onChange: (value: string ) => void;
  options: string[];
  className?: string
}

export const SelectInput: React.FC<SelectInputProps> = ({ className, label, value, onChange, options }) => (
  <div className={`m-2 p-2 space-y-2 ${className}`}>
    <Label className="text-base font-medium text-gray-700">{label}</Label>
    <Select value={value.toString()} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent >
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

interface MultiSelectInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ label, values, onChange, options }) => (
  <div className="m-2 p-2">
    <Label className="text-base font-medium text-gray-700">{label}</Label>
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={values.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...values, option]);
              } else {
                onChange(values.filter((v) => v !== option));
              }
            }}
          />
          <Label htmlFor={option}>{option}</Label>
        </div>
      ))}
    </div>
  </div>
);

interface BooleanInputProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({ label, value, onChange }) => (
  <div className="m-2 p-2 flex items-center space-x-2">
    <Checkbox
      id={label}
      checked={value}
      onCheckedChange={(checked) => onChange(checked as boolean)}
    />
    <Label htmlFor={label} className="text-base font-medium text-gray-700">{label}</Label>
  </div>
);

