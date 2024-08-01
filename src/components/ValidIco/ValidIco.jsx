/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Tooltip } from '@mantine/core';
import './validIco.scss';

const ValidIco = ({ mensaje }) => {
  return (
    <div className="ico-req">
      <Tooltip label={mensaje} position="top-end">
        <i className="fa-solid fa-circle-exclamation "></i>
      </Tooltip>
    </div>
  );
};

export default ValidIco;
