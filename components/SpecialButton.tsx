const SpecialButton = ({
  children,
  info,
}: {
  children: React.ReactNode;
  info?: boolean;
}) => {
  return (
    <button
      className={`relative overflow-hidden group ${info ? "bg-primary-foreground text-primary hover:shadow-2xl shadow-secondary border-secondary" : "bg-primary text-primary-foreground hover:shadow-2xl shadow-primary border-primary"} transition-all duration-300  cursor-pointer border px-8 py-2 uppercase`}>
      <span
        className={`absolute left-0 top-0 w-full h-full -translate-y-full group-hover:translate-y-0 transition duration-300 ${info ? "bg-secondary" : "bg-primary-foreground"}`}
      />
      <span
        className={`relative ${info ? "group-hover:text-primary-foreground text-secondary" : "group-hover:text-primary"} group-hover:text-primary transition duration-300`}>
        {children}
      </span>
    </button>
  );
};

export default SpecialButton;
