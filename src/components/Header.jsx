import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Header({
  variant = "home",
  backTo = "/",
  backLabel = "Home",
  showNav = false,
}) {
  return (
    <header className="top-nav">
      <Link to="/" className="nav-brand-link" aria-label="Dovroyn home">
        <BrandLogo />
      </Link>
      <nav className="top-nav-links">
        {variant === "home" ? (
          <>
            <Link className="nav-link-subtle" to="/pricing">Pricing</Link>
            <Link className="nav-link-subtle" to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link className="nav-link-subtle" to={backTo}>{backLabel}</Link>
            {showNav && (
              <>
                <Link className="nav-link-subtle" to="/pricing">Pricing</Link>
                <Link className="nav-link-subtle" to="/login">Login</Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
