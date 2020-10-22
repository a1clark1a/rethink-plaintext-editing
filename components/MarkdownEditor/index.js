import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import SimpleMDE from 'react-simplemde-editor';

import css from '../../styles/editor.module.css';
import { set } from 'lodash';

function MarkdownEditor({ file, write }) {
  const [newFile, setNewFile] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {
    (async () => {
      setNewFile({
        text: await file.text(),
        name: await path.basename(file.name)
      });
    })();
  }, [file]);

  const save = e => {
    e.preventDefault();
    const file = new File([newFile.text], newFile.name, {
      type: 'text/markdown',
      lastModified: new Date()
    });
    write(file);
  };

  const handleChange = event => {
    setNewFile({ ...newFile, text: event });
  };

  return (
    <form className={css.editor} onSubmit={save}>
      {allowEdit ? (
        <div>
          <input
            type="text"
            onChange={e => setNewFile({ ...newFile, name: e.target.value })}
          ></input>
          <button
            className={css.button}
            type="button"
            onClick={() => setAllowEdit(false)}
          >
            Save
          </button>
        </div>
      ) : (
        <h3>
          {file && newFile?.name ? newFile?.name : 'add a name for the file'}
          <button
            className={css.button}
            type="button"
            onClick={() => setAllowEdit(true)}
          >
            Edit
          </button>
        </h3>
      )}
      <SimpleMDE onChange={e => handleChange(e)} value={newFile.text} />
      <button className={css.button} type="submit">
        Save
      </button>
    </form>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
