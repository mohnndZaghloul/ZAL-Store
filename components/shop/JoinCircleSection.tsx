const JoinCircleSection = () => {
  return (
    <section className="bg-linear-45 from-primary/95 via-primary to-primary/95 text-primary-foreground  border-y py-12 md:py-24 flex flex-col justify-center items-center">
      <h1 className="text-3xl md:text-5xl">Join the Inner Circle</h1>
      <p className="text-center w-full max-w-sm text-xs md:text-sm text-primary-foreground/50 py-6 md:py-8 md:px-2 px-8">
        Receive early access to new drops and exclusive streetwear editorials
        directly to your inbox.
      </p>
      <form>
        <div className="w-full md:min-w-sm flex justify-between border-b">
          <input
            type="text"
            placeholder="your email address"
            className="placeholder:text-[10px] md:placeholder:text-sm placeholder:uppercase outline-0 w-full text-[10px] md:text-sm"
          />
          <button className="cursor-pointer px-4 text-primary-foreground hover:text-secondary transition duration-300 uppercase tracking-widest text-[10px] md:text-sm text-nowrap">
            sign up
          </button>
        </div>
      </form>
    </section>
  );
};

export default JoinCircleSection;
