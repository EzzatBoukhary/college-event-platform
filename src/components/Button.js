import React from 'react';

function Button({ text, onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className="button">
      {text}
    </button>
  );
}

export default Button;