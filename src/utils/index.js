export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const getSize = size => {
  const gb = size / Math.pow(1024, 3);
  const fragments = gb.toString().split('.');
  return `${fragments[0]}.${fragments[1].substr(0, 2)} GB`;
};

export const getFileName = file => file.name.split('.').splice(0, 4).join(' ');
