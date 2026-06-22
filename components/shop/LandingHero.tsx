import SpecialButton from "../SpecialButton";

const LandingHero = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center md:items-center px-2">
      <h1 className="text-6xl md:text-7xl font-semibold uppercase">
        MODERN CASUAL
      </h1>
      <p className="w-full max-w-sm md:text-center my-8">
        Youthful essentials and street-inspired minimalism designed for the new
        generation of comfort and style.
      </p>
      <div className="flex flex-col md:flex-row gap-4 text-xs md:text-sm">
        <SpecialButton>explore collection</SpecialButton>
        <SpecialButton info>view lookbook</SpecialButton>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-2">
        <span className="uppercase text-xs text-primary/50">
          scroll to discover
        </span>
        <span className="relative overflow-hidden w-px h-10 bg-primary/50 block">
          <span className="absolute bottom-0 left-0 w-px h-[400%] translate-y-0 animate-bounce ease-out bg-primary" />
        </span>
      </div>
    </section>
  );
};

export default LandingHero;
