import Image from "next/image";
import SpecialButton from "../SpecialButton";
import heroImage from "@/public/images/Hero.webp";
import AnimatedBox from "./AnimatedBox";
import NavLink from "../layout/header/NavLink";

const LandingHero = () => {
  return (
    <section className="relative h-screen text-primary-foreground">
      <div className="relative h-full w-full">
        <Image
          src={heroImage}
          alt="Landing Hero"
          className="object-cover"
          fill
          priority
        />
        <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-primary to-transparent" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 w-full h-full flex flex-col justify-center items-start md:items-center">
        <AnimatedBox>
          <h1 className="text-6xl md:text-7xl font-semibold uppercase inline">
            MODERN CASUAL
          </h1>
        </AnimatedBox>
        <AnimatedBox>
          <p className="w max-w-sm md:text-center my-8">
            Youthful essentials and street-inspired minimalism designed for the
            new generation of comfort and style.
          </p>
        </AnimatedBox>
        <AnimatedBox>
          <SpecialButton>
            <NavLink href="./collections">explore collection</NavLink>
          </SpecialButton>
        </AnimatedBox>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-2">
        <span className="uppercase text-xs text-primary-foreground">
          scroll to discover
        </span>
        <span className="relative overflow-hidden w-px h-10 bg-primary-foreground block">
          <span className="absolute bottom-0 left-0 w-px h-[400%] translate-y-0 animate-bounce ease-out bg-primary" />
        </span>
      </div>
    </section>
  );
};

export default LandingHero;
