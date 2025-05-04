
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StressItemProps {
  id: string;
  label: string;
  points: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  index: number;
}

const StressItem: React.FC<StressItemProps> = ({ 
  id, 
  label, 
  points, 
  checked, 
  onChange,
  index
}) => {
  // Calculate staggered animation delay based on index
  const delay = index * 50;

  return (
    <div 
      className="flex items-center space-x-2 p-3 rounded-lg bg-white shadow-sm mb-2 border border-cesilite/10 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={onChange}
        className="border-cesilite"
      />
      <div className="flex-1">
        <Label 
          htmlFor={id} 
          className="text-foreground cursor-pointer flex-1"
        >
          {label}
        </Label>
      </div>
      <span className="text-sm font-medium text-cesilite">{points} pts</span>
    </div>
  );
};

export default StressItem;
