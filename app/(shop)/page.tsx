import NavLink from "@/components/header/NavLink";
import JoinCircleSection from "@/components/shop/JoinCircleSection";
import LandingHero from "@/components/shop/LandingHero";
import ProductsSlider from "@/components/shop/ProductsSlider";
import SamplesSection from "@/components/shop/SamplesSection";

export default function Home() {
  return (
    <main className="">
      <LandingHero />
      <SamplesSection />
      <ProductsSlider />
      <JoinCircleSection />
      <footer>
        <div className="container flex flex-col md:flex-row gap-8 md:gap-4 justify-between md:items-start py-8 md:py-12">
          <div className="space-y-4 max-w-xs">
            <h1 className="text-2xl md:text-4xl uppercase">zal</h1>
            <p className="text-xs md:text-sm">
              Youthful casual wear for the modern minimalist. Rooted in comfort,
              designed for the streets.
            </p>
          </div>
          <div className="flex flex-1 justify-between md:justify-evenly gap-4">
            <div className="space-y-2 md:space-y-5">
              <p className="uppercase text-sm font-semibold tracking-widest">
                shop
              </p>
              <ul className="space-y-2 md:space-y-5 capitalize text-xs">
                <li>new arrivals</li>
                <li>collections</li>
                <li>basics</li>
              </ul>
            </div>
            <div className="space-y-2 md:space-y-5">
              <p className="uppercase text-sm font-semibold tracking-widest">
                support
              </p>
              <ul className="space-y-2 md:space-y-5 capitalize text-xs">
                <li>shipping</li>
                <li>returns</li>
                <li>size guide</li>
                <li>contact us</li>
              </ul>
            </div>
            <div className="space-y-2 md:space-y-5">
              <p className="uppercase text-sm font-semibold tracking-widest">
                social
              </p>
              <ul className="space-y-2 md:space-y-5 capitalize text-xs">
                <li>
                  <NavLink
                    className="w-fit"
                    href="https://www.instagram.com/zal.eg/">
                    instgram
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="w-fit"
                    href="https://www.facebook.com/profile.php?id=61590810387117">
                    facebook
                  </NavLink>
                </li>
                <li>
                  <NavLink className="w-fit" href="mailto:zaaaal.eg@gmail.com">
                    our E-mail
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/20">
          <div className="container flex justify-between items-center py-4 text-[10px] md:text-sm text-primary/50">
            <p>© 2026 ZAL. ALL RIGHTS RESERVED.</p>
            <div className="space-x-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
