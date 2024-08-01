/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

// Define your custom component
const CustomComponent = () => {
  return <div>Custom Component</div>;
};

// Define a mapping object that associates your strings with the corresponding React components:
const componentMap = {
  div: 'div', // Just use the built-in "div" component as an example
  customComponent: CustomComponent, // Replace "CustomComponent" with the actual component you want to use
  // Add more entries as needed
};

const Tag = ({ onClick, className, children, Etiqueta, style }) => {
  const handleKeyUp = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  // Check if the Etiqueta prop is a string representing an HTML tag name
  const isHTMLTag = typeof Etiqueta === 'string';

  // If Etiqueta is a string representing an HTML tag, use it directly as the component type
  const ComponentToRender = isHTMLTag ? Etiqueta : componentMap[Etiqueta];

  // If the Etiqueta prop doesn't exist in the component map and is not an HTML tag, default to "div" component
  const FinalComponent = ComponentToRender || 'div';

  return (
    <FinalComponent
      className={className}
      role="button"
      tabIndex="0"
      onClick={onClick}
      onKeyUp={handleKeyUp}
      style={style}
    >
      {children}
    </FinalComponent>
  );
};

export default Tag;
