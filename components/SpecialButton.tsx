const SpecialButton = ({
  children,
  className,
  onClick,
  info,
  destructive,
  disable,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  info?: boolean;
  destructive?: boolean;
  disable?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disable}
      className={`${className}  relative overflow-hidden group active:scale-90 active:translate-y-1 ${info ? "bg-primary-foreground text-primary hover:shadow-2xl shadow-secondary border-secondary" : destructive ? "bg-primary-foreground text-destructive hover:shadow-2xl shadow-destructive border-destructive" : "bg-primary text-primary-foreground hover:shadow-2xl shadow-primary border-primary"} transition-all duration-300  cursor-pointer border px-8 py-2 uppercase`}>
      <span
        className={`absolute left-0 top-0 w-full h-full -translate-y-full group-hover:translate-y-0 ${disable && "translate-y-0"} transition duration-300 ${info ? "bg-secondary" : "bg-primary-foreground"}`}
      />
      <span
        className={`relative ${info ? "group-hover:text-primary-foreground text-secondary" : destructive ? "group-hover:text-destructive" : "group-hover:text-primary"} ${disable && "text-primary"} transition duration-300`}>
        {children}
      </span>
    </button>
  );
};

export default SpecialButton;
