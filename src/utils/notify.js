import isFunction from 'lodash/isFunction';
const { ipcRenderer, remote } = window.electron;

function notify(title, body, interaction) {
  ipcRenderer.on('notify-click', () => {
    interaction();
  });

  ipcRenderer.send('notify', {
    title: title,
    body: body,
    ...(interaction && isFunction(interaction)
      ? { click: true }
      : { open: interaction })
  });
}

export default notify;
