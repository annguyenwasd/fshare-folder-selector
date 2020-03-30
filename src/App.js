import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import defaultFilms from "./default-films.json";
import { copyToClipboard, getSize } from "./utils";
import Code from "./components/code";

function App() {
  const [listFiles, setListFiles] = useState(null);
  const [files, setFiles] = useState([]);
  const fileIds = useRef({});
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("list"));
    if (list && list.length) {
      const newFiles = [];
      list.forEach(file => {
        if (!fileIds.current[file.id]) {
          fileIds.current[file.id] = 1;
          newFiles.push(file);
        }
      });
      setListFiles(newFiles);
    } else {
      setListFiles(defaultFilms);
    }
  }, []);

  return (
    <form
      className="App"
      onSubmit={e => {
        e.preventDefault();
        const links = files
          .map(file => `https://fshare.vn/file/${file.linkcode}`)
          .join(";");
        copyToClipboard(links);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }}
    >
      <h1>FShare Tool Link Selector</h1>
      <Code />
      <br />
      <br />
      <label>
        Import JSON file: &nbsp;
        <input
          type="file"
          onChange={e => {
            const blob = new Blob([e.target.files[0]], {
              type: "application/json"
            });
            blob.text().then(json => {
              const parsedData = JSON.parse(json);
              const temp = [];
              parsedData.forEach(file => {
                if (!fileIds.current[file.id]) {
                  fileIds.current[file.id] = 1;
                  temp.push(file);
                }
              });
              const newFiles = [...files, ...temp];
              setListFiles(newFiles);
              localStorage.setItem("list", JSON.stringify(newFiles));
            });
          }}
        />
      </label>
      <div className="sticky">
        <br />
        <label>
          Search: &nbsp;
          <input autoFocus onChange={e => setSearch(e.target.value)} />
        </label>
        <br />
        <br />
        {files && files.length > 0 && (
          <>
            <button type="button" onClick={() => setFiles([])}>
              Remove {files.length} file(s) selected.{" "}
            </button>
          </>
        )}
        &nbsp;
        <button
          type="button"
          onClick={() => {
            setListFiles([]);
            localStorage.removeItem("list");
          }}
          title="Clear list bellow, default list will be loaded when you reload browser"
        >
          Clear
        </button>
        &nbsp;
        <button
          disabled={!files.length}
          type="submit"
          title="Get links for FShare Tool"
        >
          Get Links
        </button>
        <br />
        <br />
        {copied && <div>Done!</div>}
      </div>
      {listFiles &&
        listFiles
          .filter(
            file =>
              file.name.toLowerCase().indexOf(search) > -1 ||
              files.includes(file)
          )
          .map(file => (
            <div
              key={file.id}
              className={files.includes(file) ? "film checked" : "film"}
            >
              <label>
                <input
                  type="checkbox"
                  checked={files.includes(file)}
                  onChange={e => {
                    if (e.target.checked) {
                      setFiles([...files, file]);
                    } else {
                      setFiles(files.filter(f => f.id !== file.id));
                    }
                  }}
                />
                &nbsp;
                {file.name} - {getSize(file.size)}
                <a
                  href={`https://fshare.vn/file/${file.linkcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fshare link
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${file.name
                    .split(".")
                    .join(" ")
                    .substr(0, file.name.length / 2)} trailer`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find trailer
                </a>
              </label>
            </div>
          ))}
    </form>
  );
}

export default App;
