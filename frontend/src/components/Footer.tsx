import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        © {new Date().getFullYear()} Mesto Russia
      </p>
    </footer>
  );
};

export default Footer;
