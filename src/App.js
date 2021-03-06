import React, { useEffect, useState, useRef } from 'react';
import 'App.css';
import defaultFilms from 'default-films.json';
import { copyToClipboard } from 'utils';
import Intro from 'components/intro';
import File from 'components/file';

function App() {
  const [listFiles, setListFiles] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileIds = useRef(new Set());
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('list'));
    if (list && list.length) {
      const newFiles = [];
      list.forEach(file => {
        if (!fileIds.current.has(file.id)) {
          fileIds.current.add(file.id);
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
        const links = selectedFiles
          .map(file => `https://fshare.vn/file/${file.linkcode}`)
          .join(';');
        copyToClipboard(links);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }}>
      <Intro />
      <br />
      <br />
      <label>
        Import JSON file: &nbsp;
        <input
          type="file"
          onChange={e => {
            const blob = new Blob([e.target.files[0]], {
              type: 'application/json'
            });
            blob.text().then(json => {
              const parsedData = JSON.parse(json);
              const temp = [];
              parsedData.forEach(file => {
                if (!fileIds.current.has(file.id)) {
                  fileIds.current.add(file.id);
                  temp.push(file);
                }
              });
              const newFiles = [...listFiles, ...temp].sort();
              setListFiles(newFiles);
              localStorage.setItem('list', JSON.stringify(newFiles));
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
        {selectedFiles && selectedFiles.length > 0 && (
          <>
            <button type="button" onClick={() => setSelectedFiles([])}>
              Remove {selectedFiles.length} file(s) selected.{' '}
            </button>
          </>
        )}
        &nbsp;
        <button
          type="button"
          onClick={() => {
            setListFiles([]);
            localStorage.removeItem('list');
          }}
          title="Clear list bellow, default list will be loaded when you reload browser">
          Clear
        </button>
        &nbsp;
        <button
          disabled={!selectedFiles.length}
          type="submit"
          title="Get links for FShare Tool">
          Get Links
        </button>
        <br />
        <br />
        {copied && <div>Done!</div>}
      </div>
      <br />
      {listFiles && <i>Total: {listFiles.length} files</i>}
      <br />

      {listFiles &&
        listFiles
          .filter(
            file =>
              file.name.toLowerCase().indexOf(search) > -1 ||
              selectedFiles.includes(file)
          )
          .map(file => (
            <File
              key={file.id}
              checked={selectedFiles.includes(file)}
              file={file}
              className={selectedFiles.includes(file) ? 'film checked' : 'film'}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedFiles([...selectedFiles, file]);
                } else {
                  setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
                }
              }}
            />
          ))}
    </form>
  );
}

export default App;
