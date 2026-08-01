import { Link } from "react-router-dom";

export default function Footer({ variant = "minimal" }) {
  if (variant === "full") {
    return (
      <footer className="landing-footer">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Dovroyn. Built by Anglow Digital PTY LTD.</p>
        <nav className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    );
  }

  return (
    <footer className="landing-footer">
      <p className="footer-copyright">&copy; {new Date().getFullYear()} Dovroyn. Built by Anglow Digital PTY LTD.</p>
      <nav className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/pricing">Pricing</Link>
      </nav>
    </footer>
  );
}
