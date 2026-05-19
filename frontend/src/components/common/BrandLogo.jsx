import { Link } from "react-router-dom";
import logo from "../../assets/tentation-logo.jpeg";

const BrandLogo = ({ withText = true, frosted = true }) => (
  <Link to="/" className="flex items-center gap-3 group">
    <img
      src={logo}
      alt="Tentation Immobilière"
      className="h-10 w-auto rounded-xl object-contain transition-opacity group-hover:opacity-80"
    />
    {withText && (
      <div className="hidden sm:block">
        <p className={`text-base font-semibold tracking-[0.28em] transition-colors ${frosted ? "text-ink dark:text-white" : "text-white"}`}>
          TENTATION
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.55em] text-bronze">
          Immobilière
        </p>
      </div>
    )}
  </Link>
);

export default BrandLogo;
