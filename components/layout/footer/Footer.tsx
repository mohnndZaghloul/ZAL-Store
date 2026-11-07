import JoinCircleSection from "@/components/layout/footer/JoinCircleSection";
import NavLink from "../header/NavLink";
import SizeGuideDialog from "./SizeGuideDialog";
import PolicyDialog from "./PolicyDialog";

const Footer = () => {
  return (
    <footer>
      <JoinCircleSection />
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
            <NavLink className="w-fit" href="/collections?category=pullover">
  new arrivals
</NavLink>
<NavLink className="w-fit" href="/collections">
  collections
</NavLink>
            </ul>
          </div>
          <div className="space-y-2 md:space-y-5">
            <p className="uppercase text-sm font-semibold tracking-widest">
              support
            </p>
            <ul className="space-y-2 md:space-y-5 capitalize text-xs">
            <li>
  <PolicyDialog />
</li>
              <li>
  <SizeGuideDialog />
</li>
<li>
  <NavLink
    className="w-fit"
    href="https://wa.me/201092766581?text=Hello%20ZAL!%20%F0%9F%91%8B%20I'm%20interested%20in%20your%20products%20and%20would%20like%20to%20ask%20about%20something.%20Could%20you%20please%20help%20me%3F"
  >
    contact us
  </NavLink>
</li>
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
                <NavLink
                  className="w-fit"
                  href="https://www.tiktok.com/@zal.eg">
                  TikTok
                </NavLink>
              </li>
              <li>
  <NavLink
    className="w-fit"
    href="mailto:zaaaal.eg@gmail.com?subject=Hello%20ZAL&body=Hello%20ZAL%20Team%2C"
  >
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
  );
};

export default Footer;
