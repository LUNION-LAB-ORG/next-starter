import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddButton from "@/components/(protected)/dashboard/biens/add-button";

interface SelectOption {
  id: string;
  name: string;
}

export interface SelectWithAddButtonProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onAddClick: () => void;
  addButtonTooltip?: string;
}

export function SelectWithAddButton({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  disabled = false,
  loading = false,
  onAddClick,
  addButtonTooltip,
}: SelectWithAddButtonProps) {
  return (
    <div className="inline-flex items-start gap-2">
      <Select
        onValueChange={onValueChange}
        value={value}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <AddButton
        loading={loading}
        tooltipMessage={addButtonTooltip ?? "Ajouter un nouvel élément"}
        onClick={onAddClick}
      />
    </div>
  );
}
