import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';
import marked from 'marked';

import { listFiles } from '../files';

// Used below, these need to be registered
import MarkdownEditor from '../components/MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';
import CodePreviewer from '../components/CodePreviewer';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from '../styles/index.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile, closeEditor }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => {
                setActiveFile(file);
                closeEditor();
              }}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

// Refactored Previewer to not show editor unless clicked and to render CodePreviewer
function Previewer({ file, openEditor }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      if (file?.type === 'text/plain') {
        setValue(await file.text());
      } else {
        setValue(marked(await file.text()));
      }
    })();
  }, [file]);

  const RenderPreview = ({ file, value }) => {
    if (file?.type === 'text/plain') {
      return <div className={css.content}>{value}</div>;
    } else if (file?.type === 'text/markdown') {
      return (
        <article
          style={{ margin: '0 20px 0 20px' }}
          dangerouslySetInnerHTML={{ __html: value }}
        ></article>
      );
    } else if (
      file?.type === 'text/javascript' ||
      file?.type === 'application/json'
    ) {
      return <CodePreviewer file={file}></CodePreviewer>;
    }
    return <h3 style={{ marginLeft: '20px' }}>Unknown File</h3>;
  };

  return (
    <div className={css.container}>
      {file?.type !== 'text/javascript' &&
        file?.type !== 'application/json' && (
          <h3>Click on the content to edit </h3>
        )}
      <div className={css.preview} onClick={openEditor}>
        <div className={css.title}>{path.basename(file.name)}</div>
        <RenderPreview file={file} value={value} />
      </div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  'text/plain': PlaintextEditor,
  'text/markdown': MarkdownEditor
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {
    const file = listFiles();
    setFiles(file);
  }, []);

  const write = file => {
    console.log('Writing soon... ', file.name);

    // Check for duplicate file name
    let exist = false;
    for (const [key, value] of Object.entries(files)) {
      if (path.basename(value.name) === file.name) {
        exist = true;
      }
    }
    !exist && setFiles(files.concat(file));

    setActiveFile(file);
    closeEditor();
    // TODO Depending on the project needs I would either make a POST request call here or create an objectfile here to make the changes persist
  };

  const openEditor = () => {
    setAllowEdit(true);
  };

  const closeEditor = () => {
    setAllowEdit(false);
  };

  const Editor =
    activeFile && allowEdit ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          closeEditor={closeEditor}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} openEditor={openEditor} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
