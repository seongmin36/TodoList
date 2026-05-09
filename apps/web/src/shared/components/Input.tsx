import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = "text", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-0.5 w-full">
        <label className="text-xs text-label leading-[1.125rem]">{label}</label>
        <input
          ref={ref}
          type={type}
          {...rest}
          className={[
            "h-9 bg-input-bg border-[1.5px] rounded px-2.5 py-2 text-[0.8125rem] text-dark/80 placeholder:text-placeholder outline-none transition-colors duration-150 w-full",
            error
              ? "border-today focus:border-today"
              : "border-border-input focus:border-dark",
          ].join(" ")}
        />
        {error && (
          <span className="text-[0.6875rem] text-today leading-4">{error}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
