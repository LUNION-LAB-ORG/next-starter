import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type BaseFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function BaseFormSheet(props: BaseFormSheetProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent>
        {props.children}
      </SheetContent>
    </Sheet>
  );
}

export default BaseFormSheet;