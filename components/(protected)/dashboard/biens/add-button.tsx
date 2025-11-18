import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";

type AddButtonProps = {
  loading: boolean;
  tooltipMessage: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function AddButton({loading, tooltipMessage, onClick}: AddButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="rounded-full"
          variant="outline"
          type="button"
          onClick={onClick}
          disabled={loading}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <Plus />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {tooltipMessage}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default AddButton;