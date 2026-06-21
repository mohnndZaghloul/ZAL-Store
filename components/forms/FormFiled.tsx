import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type FormFiled_TP = {
  id: string;
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string | string[];
  error?: string;
  isTextArea?: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement, HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => void;
};

const FormFiled = ({
  id,
  label,
  name,
  type,
  placeholder,
  className,
  value,
  error,
  onChange,
  isTextArea,
  ...props
}: FormFiled_TP) => {
  return (
    <>
      <div className="flex justify-between">
        <Label htmlFor={id} className={`uppercase ${className}`}>
          {label || name}
        </Label>
        {error && <p className="text-destructive text-end text-xs">{error}</p>}
      </div>
      {!isTextArea ? (
        <Input
          id={id}
          name={name}
          type={type || "text"}
          placeholder={placeholder || name}
          className={cn("placeholder:capitalize", className)}
          value={value ?? ""}
          onChange={(e) => onChange(e)}
          {...props}
        />
      ) : (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder || name}
          value={value ?? ""}
          rows={5}
          onChange={onChange ? (e) => onChange(e) : () => {}}
          className={cn("placeholder:capitalize")}
        />
      )}
    </>
  );
};

export default FormFiled;
