import { Link } from "react-router-dom";
import logo from "../../assets/tentation-logo.jpeg";

const BrandLogo = ({ withText = true }) => (
  <Link to="/" className="flex items-center gap-3">
    <img src={logo} alt="Tentation Immobiliere" className="h-12 w-auto rounded-lg object-contain" />
    {withText && (
      <div className="hidden sm:block">
        <p className="text-lg font-semibold tracking-[0.24em] text-forest dark:text-white">TENTATION</p>
        <p className="text-[10px] uppercase tracking-[0.5em] text-bronze">Immobiliere</p>
      </div>
    )}
  </Link>
);

export default BrandLogo;
