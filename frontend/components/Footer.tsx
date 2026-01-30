"use client";

const Footer: React.FC = () => {
  return (
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center pb-4">
      <p className="text-xs text-center">
        © 2026 Incus Audio. All rights reserved. | A{" "}
        <a
          href="https://forta.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          forta.studio
        </a>{" "}
        production.
      </p>
    </footer>
  );
};

export default Footer;

