function notify(title, body, data = null) {
  const options = Object.freeze({
    body,
    data
  });
  let notification;
  // Check browser support
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }

  // Check permission
  else if (Notification.permission === 'granted') {
    notification = new Notification(title, options);
  }

  // Ask for permission if needed
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        notification = new Notification(title, options);
      }
    });
  }

  notification.onclick = function(e) {
    const { data } = e.target;
    //TO DO diversify the data, check if it is url then apply the one below
    if (data.includes('https://')) window.location.href = data;
    else if (data.includes('/')) window.routerHistory.push(data); //TODO find better way
  };
}

export default notify;
