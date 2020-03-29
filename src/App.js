import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import xxx from "./xxx";
import noImg from "./no_img.jpg";
import defaultFilms from "./default-films.json";

const posterPath = "https://image.tmdb.org/t/p/w500";

const copyToClipboard = str => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const getFilmName = name =>
  name
    .split("2160p")[0]
    .split(".")
    .join(" ")
    .trim();

const getSize = size => {
  const gb = size / Math.pow(1024, 3);
  const fragments = gb.toString().split(".");
  return `${fragments[0]}.${fragments[1].substr(0, 2)} GB`;
};

function App() {
  const [listRender, setListRender] = useState(null);
  const [files, setFiles] = useState([]);
  const fileIds = useRef({});
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const parseFilm = parsedData => {
    const temp = [];
    parsedData.forEach(file => {
      if (!fileIds.current[file.id]) {
        fileIds.current[file.id] = 1;
        file.bName = getFilmName(file.name);
        const nameFragments = file.bName.split(" ").reverse();
        file.year = nameFragments.splice(0, 1)[0];
        file.nameOnly = nameFragments.reverse().join(" ");
        temp.push(file);
      }
    });
    return temp;
  };
  const [listFiles, setListFiles] = useState(parseFilm(defaultFilms));

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
    }
  }, []);

  useEffect(() => {
    if (listFiles) {
      Promise.all(
        listFiles.map(f =>
          fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${xxx.name}&query=${f.nameOnly}&year=${f.year}`
          )
        )
      )
        .then(data => Promise.all(data.map(d => d.json())))
        .then(data => {
          const newList = [...listFiles].map((file, i) => {
            if (!data[i]) {
              file.img = noImg;
              return file;
            }

            const result = data[i].results;
            if (result.length) {
              const img = result[0].poster_path;
              file.img = `${posterPath}${img === "null" ? noImg : img}`;
            }
            return file;
          });

          setListRender(newList);
          localStorage.setItem("list", JSON.stringify(newList));
        });
    }
  }, [listFiles]);

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
              const temp = parseFilm(parsedData);
              const newFiles = [...files, ...temp];
              setListFiles(newFiles);
              localStorage.setItem("list", JSON.stringify(newFiles));
            });
          }}
        />
      </label>
      <div>
        <br />
        <label>
          Search: &nbsp;
          <input autoFocus onChange={e => setSearch(e.target.value)} />
        </label>
        <br />
        <button disabled={!files.length} type="submit">
          Get Links
        </button>
      </div>
      {copied && <div>Done!</div>}
      <br />
      {files && files.length > 0 && (
        <div>
          {files.length} file(s) selected.{" "}
          <button type="button" onClick={() => setFiles([])}>
            Remove all
          </button>
        </div>
      )}
      <br />
      {(listRender || listFiles || [])
        .filter(
          file =>
            file.name.toLowerCase().indexOf(search) > -1 || files.includes(file)
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
              {file.img && (
                <img
                  alt={file.name}
                  src={file.img}
                  style={{
                    width: 200,
                    height: 200
                  }}
                />
              )}
              <a
                href={`https://fshare.vn/file/${file.linkcode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.bName} - {getSize(file.size)}
              </a>
            </label>
          </div>
        ))}
    </form>
  );
}

export default App;
