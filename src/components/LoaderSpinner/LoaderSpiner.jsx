/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import './loaderSpiner.scss';

const LoaderSpiner = ({ size }) => {
  return <div id="loading" style={{ width: `${size}px`, height: `${size}px` }}></div>;
};

export default LoaderSpiner;
