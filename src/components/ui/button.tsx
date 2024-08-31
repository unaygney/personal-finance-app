import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center  justify-center leading-5 whitespace-nowrap rounded-[8px] text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-grey-900 text-white hover:bg-grey-500",
        secondary:
          "bg-beige-100 text-grey-900 hover:bg-white border border-white hover:border-beige-500",
        tertiary: "bg-transparent text-grey-500 hover:text-grey-900  ",
        destroy: "bg-secondary-red text-white hover:bg-secondary-red/90",
      },
      size: {
        default: "p-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      {
        variant: "tertiary",
        size: "default",
        className: "p-0 font-normal ",
      },
      {
        variant: "tertiary",
        size: "sm",
        className: "p-0 font-normal",
      },
      {
        variant: "tertiary",
        size: "lg",
        className: "p-0 font-normal",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
