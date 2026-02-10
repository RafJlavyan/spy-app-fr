import React from "react";
import { useLanguage } from "../shared/LanguageContext";
import "./LanguageSwitcher.scss";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === "am" ? "active" : ""}`}
        onClick={() => setLanguage("am")}
      >
        AM
      </button>
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
