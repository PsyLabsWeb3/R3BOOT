import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({ className, children, side = "right", ...props }) {
  if (!["right", "left", "top", "bottom"].includes(side)) {
    throw new Error(
      `Invalid side prop: ${side}. Expected one of "right", "left", "top", or "bottom".`
    );
  }
  if (side === "top" || side === "bottom") {
    props.style = { ...props.style, width: "100%" };
  } else {
    props.style = { ...props.style, height: "100%" };
  }
  if (side === "left") {
    props.style = { ...props.style, left: 0 };
  } else if (side === "right") {
    props.style = { ...props.style, right: 0 };
  } else if (side === "top") {
    props.style = { ...props.style, top: 0 };
  } else if (side === "bottom") {
    props.style = { ...props.style, bottom: 0 };
  }
  props.style = { ...props.style, zIndex: 50 };
  props.style = { ...props.style, position: "fixed" };
  props.style = { ...props.style, display: "flex" };
  props.style = { ...props.style, flexDirection: "column" };
  props.style = { ...props.style, gap: "1rem" };
  props.style = { ...props.style, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" };
  props.style = { ...props.style, transition: "ease-in-out" };
  props.style = {
    ...props.style,
    transitionDuration: "300ms",
    transitionTimingFunction: "ease-in-out",
  };
  props.style = {
    ...props.style,
    transitionProperty: "transform, opacity",
  };
  props.style = {
    ...props.style,
    transform: "translateX(0)",
    opacity: 1,
  };
  if (side === "right") {
    props.style = { ...props.style, transform: "translateX(100%)" };
  } else if (side === "left") {
    props.style = { ...props.style, transform: "translateX(-100%)" };
  } else if (side === "top") {
    props.style = { ...props.style, transform: "translateY(-100%)" };
  } else if (side === "bottom") {
    props.style = { ...props.style, transform: "translateY(100%)" };
  }
  props.style = {
    ...props.style,
    transitionDuration: "500ms",
  };
  props.style = {
    ...props.style,
    transitionTimingFunction: "ease-in-out",
  };
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
