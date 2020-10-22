import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import Prism from 'prismjs';

import css from '../../styles/editor.module.css';

const CodePreviewer = ({ file }) => {
  const [newFile, setNewFile] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
    (async () => {
      setNewFile({
        text: await file.text(),
        name: await path.basename(file.name)
      });
    })();
  }, [file]);

  return (
    <div className={css.container}>
      <pre className={`language-${path.basename(file.type)}`}>
        <code>{newFile.text}</code>
      </pre>
    </div>
  );
};

CodePreviewer.propTypes = {
  file: PropTypes.object
};

export default CodePreviewer;
