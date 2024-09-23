import ReactCodeMirror from "@uiw/react-codemirror";
import {
  abcdef,
  bespin,
  githubDark,
  githubLight,
  monokai,
  sublime,
  vscodeDark,
  vscodeLight,
  vscodeLightStyle,
} from "@uiw/codemirror-themes-all";
import React, { useEffect, useState } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import "./Editor.css";
import ACTIONS from "../../../Utilities/Actions";

const Editor = ({ socketRef, roomId }) => {
  const languages = {
    javascript: "javascript",
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    csharp: "csharp",
    rust: "rust",
  };

  const themes = {
    bespin: { name: "Bespin", extension: bespin },
    monokai: { name: "Monokai", extension: monokai },
    sublime: { name: "Sublime", extension: sublime },
    vscodeDark: { name: "VS Code Dark", extension: vscodeDark },
    vscodeLight: { name: "VS Code Light", extension: vscodeLight },
    githubLight: { name: "GitHub Light", extension: githubLight },
    githubDark: { name: "GitHub Dark", extension: githubDark },
  };
  const [code, setCode] = useState("//Enter code  here");
  const [language, setLangauge] = useState(languages.javascript);
  const [theme, setTheme] = useState(themes.bespin);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          console.log(code, "code is coming");

          setCode((prevValue) => (prevValue = code));
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  const handleChange = (value, viewUpdate) => {
    setCode(value); // Update the state with the new value
    socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: value }); // Emit the new code to the server
  };

  const handleLanguageChange = (e) => {
    setLangauge((prev) => (prev = e.target.value));
  };

  const handleThemeChange = (e) => {
    e.preventDefault();
    setTheme((prev) => (prev = themes[e.target.value].extension));
  };
  return (
    <div className="code-editor-wrapper">
      <div className="drop-down-wrapper">
        <select
          className="drop-down  drop-down-lang"
          onChange={handleLanguageChange}
        >
          {Object.keys(languages).map((lang, index) => (
            <option value={lang} key={`${lang} - ${index}`}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="drop-down drop-down-theme"
          onChange={handleThemeChange}
        >
          {Object.keys(themes).map((theme, index) => (
            <option value={theme} key={`${theme} - ${index}`}>
              {console.log(theme)}
              {themes[theme].name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <ReactCodeMirror
        value={code}
        onChange={handleChange}
        height="550px"
        theme={theme}
        autoSave="true"
        extensions={[loadLanguage(language)]}
        className="code-editor"
      />
    </div>
  );
};

export default Editor;
