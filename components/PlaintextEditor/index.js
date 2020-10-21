import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import css from '../../styles/editor.module.css';

function PlaintextEditor({ file, write }) {
  const [newFile, setNewFile] = useState({});
  const [allowEdit, setAllowEdit] = useState(false);

  //console.log(file, write);
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
      type: 'text/plain',
      lastModified: new Date()
    });
    write(file);
  };

  const handleChange = event => {
    setNewFile({ ...newFile, text: event.target.value });
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
        <h3 className="name">
          {file && newFile.name ? newFile.name : 'add a name for the file'}

          <button
            className={css.button}
            type="button"
            onClick={() => setAllowEdit(true)}
          >
            Edit
          </button>
        </h3>
      )}
      <textarea
        value={file && newFile.text ? newFile.text : 'Write your text here'}
        rows="30"
        cols="70"
        onChange={handleChange}
      ></textarea>
      <button className={css.button} type="submit">
        Save
      </button>
    </form>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
