import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";

function AddButton({loading, tooltipMessage}: {loading: boolean; tooltipMessage: string}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="rounded-full"
          variant="outline"
          type="button"
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