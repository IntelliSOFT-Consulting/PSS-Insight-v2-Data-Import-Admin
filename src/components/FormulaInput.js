import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  inputContainer: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '4px 11px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    height: '40px',
    outline: 'none',
    transition: 'border-color 0.3s',
    '&:focus': {
      borderColor: '#40a9ff',
    },
  },
  dropdown: {
    position: 'absolute',
    top: '75px',
    left: 0,
    zIndex: 1,
    minWidth: '100%',
    padding: '4px 0',
    margin: 0,
    listStyle: 'none',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    maxHeight: '200px',
    overflow: 'auto',
  },
  option: {
    padding: '4px 11px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    backgroundColor: '#fff',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&:active': {
      backgroundColor: '#e6f7ff',
    },
  },

  warningMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '4px',
  },
});

const InputWithFormula = ({
  Form,
  form,
  Input,
  questions,
  name,
  label,
  placeholder,
  required,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const classes = useStyles();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        e.target.tagName !== 'INPUT'
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownRef]);

  const handleOptionSelect = option => {
    setSuggestions([]);
    form.setFieldsValue({
      [name]: `${form.getFieldValue(name)}${option}}`,
    });
    setShowDropdown(false);
  };

  return (
    <div className={classes.inputContainer}>
      <Form.Item
        name={name}
        label={label}
        tooltip="To add a question to your formula, just type the opening curly brace symbol '{' and choose from the options that appear. This will allow you to easily incorporate previously added questions into your formula."
        rules={[
          {
            required,
            message: `${label} is required.`,
          },
          {
            validator(_, value) {
              if (value) {
                const allowedMatch = /^[0-9.()+*/{}-]*$/;
                const lastChar = value.slice(-1);
                if (lastChar === '{') {
                  const query = value.split('{').pop();
                  const filteredOptions = questions.filter(option =>
                    option.toLowerCase().includes(query.toLowerCase())
                  );
                  setSuggestions(filteredOptions);
                  setShowDropdown(true);
                }
                if (
                  (value.match(/\(/g) || []).length !==
                    (value.match(/\)/g) || []).length ||
                  (value.match(/\{/g) || []).length !==
                    (value.match(/\}/g) || []).length
                ) {
                  return Promise.reject(
                    'Please check for any unclosed brackets.'
                  );
                }
                if (!/^(?:\{[\w\s]+\}|[\d+\-*/.()])+$/.test(value)) {
                  return Promise.reject('Invalid character.');
                }
                const operatorDecimalTest = /[-+*/.]/;
                if (operatorDecimalTest.test(value.slice(-1))) {
                  setShowDropdown(false);
                  return Promise.reject(
                    'Formula cannot end with an operator or decimal.'
                  );
                }
                const questionMatch = value.match(/{[\w\s]+}/g);
                if (questionMatch) {
                  const questionList = questionMatch.map(question =>
                    question.slice(1, -1)
                  );

                  const missingQuestions = questionList.filter(
                    question => !questions.includes(question)
                  );
                  if (missingQuestions.length > 0) {
                    return Promise.reject(
                      `Please add the following question(s) to the list: ${missingQuestions.join(
                        ', '
                      )}.`
                    );
                  }
                }
                setShowDropdown(false);
                return Promise.resolve();
              }
            },
          },
        ]}
      >
        <Input placeholder={placeholder} autoComplete='off' size='large' />
      </Form.Item>
      {showDropdown && (
        <ul ref={dropdownRef} className={classes.dropdown}>
          {suggestions.map(option => (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={classes.option}
            >
              {option}
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className={classes.option}>
              No questions added yet. Please add a question(s) to make a
              selection.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default InputWithFormula;
