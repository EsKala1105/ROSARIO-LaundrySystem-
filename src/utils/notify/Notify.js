import { notifications } from '@mantine/notifications';

export function Notify(title, message, tipo) {
  notifications.show({
    id: 'notify',
    autoClose: 5000,
    //withCloseButton: false,
    withBorder: true,
    title: title,
    message: message,
    styles: () => styles[tipo],
    onClick: () => {},
  });
}

const styles = {
  warning: {
    root: {
      backgroundColor: '#e59525',
      '&::before': { backgroundColor: '#fff' },
      // '&:hover': { backgroundColor: '#1e34c3' },
    },
    closeButton: { color: '#fff', '&:hover': { border: '1px #fff solid', backgroundColor: '#f8f9fa00' } },
    title: { color: '#fff' },
    description: { color: '#fff' },
  },
  fail: {
    root: {
      backgroundColor: '#f06969',
      '&::before': { backgroundColor: '#fff' },
      // '&:hover': { backgroundColor: '#ff0000' },
    },
    closeButton: { color: '#fff', '&:hover': { border: '1px #fff solid', backgroundColor: '#f8f9fa00' } },
    title: { color: '#fff' },
    description: { color: '#fff' },
  },
  success: {
    root: {
      backgroundColor: '#26a074',
      '&::before': { backgroundColor: '#fff' },
      // '&:hover': { backgroundColor: '#087f23' },
    },
    title: { color: '#fff' },
    closeButton: { color: '#fff', '&:hover': { border: '1px #fff solid', backgroundColor: '#f8f9fa00' } },
    description: { color: '#fff' },
  },
};
