"use client";

import React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { IAmenity } from "@/features/biens/types/biens.type";

export type CommoditeOption = {
  id?: string;
  name: string;
};

type Props = {
  options: CommoditeOption[];
  selected: IAmenity[];
  onChange: (selected: IAmenity[]) => void;
  label?: string;
  disabled?: boolean;
  onCreateNew?: (name: string) => void;
};

function CommoditeCombobox({
  options,
  selected,
  onChange,
  label = "Sélectionner des commodités",
  disabled = false,
  onCreateNew,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const selectedOptions = React.useMemo(() => {
    return selected;
  }, [selected]);

  const handleCreateNew = () => {
    if (searchValue.trim() && onCreateNew) {
      onCreateNew(searchValue.trim());
      // Ajouter automatiquement la nouvelle commodité à la sélection
      onChange([...selected, { name: searchValue.trim() }]);
      setSearchValue("");
      setOpen(false);
    }
  };

  const handleRemove = (name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selected.filter((amenity) => amenity.name !== name));
  };

  const isSelected = (optionName: string) => {
    return selected.some((amenity) => amenity.name === optionName);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-[#595959] text-sm first-letter:capitalize min-h-10 h-auto py-2"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1 items-center">
            {selectedOptions.length === 0 ? (
              <span>{label}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.name}
                  variant="secondary"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {option.name}
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-1 hover:text-destructive cursor-pointer inline-flex"
                    onClick={(e) => handleRemove(option.name, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemove(option.name, e as any);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>
            {searchValue.trim() ? (
              <div className="flex flex-col items-center justify-center py-6 text-sm">
                <p className="text-muted-foreground mb-3">
                  Créer la commodité <strong>"{searchValue.trim()}"</strong> ?
                </p>
                {onCreateNew && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCreateNew}
                    type="button"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer et ajouter
                  </Button>
                )}
              </div>
            ) : (
              "Aucun résultat."
            )}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {selected.length > 0 && !searchValue && (
                <CommandItem
                  onSelect={() => {
                    onChange([]);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Tout désélectionner
                </CommandItem>
              )}
              {filteredOptions.map((option) => {
                const selected = isSelected(option.name);
                return (
                  <CommandItem
                    key={option.id || option.name}
                    value={option.name}
                    onSelect={() => {
                      if (selected) {
                        onChange(selectedOptions.filter((amenity) => amenity.name !== option.name));
                      } else {
                        onChange([...selectedOptions, { id: option.id, name: option.name }]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CommoditeCombobox;