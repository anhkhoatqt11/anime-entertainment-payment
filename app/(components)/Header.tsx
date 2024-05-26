import React from "react";

const Header = () => {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex flex-row gap-3 items-center">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src="./logoImage.png" alt="" />
            <img className="h-6 w-auto" src="./textLogoImage.png" alt="" />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
