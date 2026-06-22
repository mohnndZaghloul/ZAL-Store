const SpecialButton = ({
  children,
  info,
}: {
  children: React.ReactNode;
  info?: boolean;
}) => {
  return (
    <button
      className={`relative overflow-hidden group ${info ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}  cursor-pointer border border-primary px-8 py-2 uppercase`}>
      <span
        className={`absolute left-0 top-0 w-full h-full -translate-y-full group-hover:translate-y-0 transition duration-300 ${info ? "bg-secondary" : "bg-primary-foreground"}`}
      />
      <span
        className={`relative ${info ? "group-hover:text-primary-foreground" : "group-hover:text-primary"} group-hover:text-primary transition duration-300`}>
        {children}
      </span>
    </button>
  );
};

export default SpecialButton;
