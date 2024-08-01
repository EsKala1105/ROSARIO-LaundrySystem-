/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import './mainLayout_Public.scss';
import { useDisclosure } from '@mantine/hooks';
import { ScrollArea } from '@mantine/core';
import { Modal } from '@mantine/core';

import CloseEmergency from '../private/close-emergency.png';
import TimeOut from '..//out-of-time.png';
import { useDispatch, useSelector } from 'react-redux';
import { messageGeneral } from '../../redux/states/negocio';

const PublicMasterLayout = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [opened, { open, close }] = useDisclosure(false);

  const MessageGeneral = useSelector((state) => state.negocio.messageGeneral);

  useEffect(() => {
    if (Object.keys(MessageGeneral).length > 0) {
      setData(MessageGeneral);
      open();
      setTimeout(() => {
        dispatch(messageGeneral({}));
      }, 5000);
    } else {
      close();
      setData();
    }
  }, [MessageGeneral]);

  return (
    <div className="principal_container_public">
      {/* <div>
				<h1>Header Publico</h1>
			</div> */}
      <section className="body_pcp">{props.children}</section>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        onClose={close}
        size={350}
        title={false}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <div className="content-message-general">
          <div className="body-ms">
            <div className="logo">
              <img
                className="ico"
                src={
                  data && (data.ico === 'time-out' ? TimeOut : data.ico === 'close-emergency' ? CloseEmergency : null)
                }
                alt=""
              />
            </div>
            <div className="header-mg">
              <h2>{data?.title}</h2>
              <p>{data?.message}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicMasterLayout;
