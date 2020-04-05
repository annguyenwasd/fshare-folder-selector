import React, { useState } from 'react';

const W = 800;
const H = 600;

function Trailer({ src }) {
  const [status, setStatus] = useState(null);

  return (
    <div
      key="src"
      style={{
        width: W,
        height: H
      }}>
      <iframe
        style={{
          border: 'none',
          visibility: status ? 'visible' : 'hidden'
        }}
        onLoad={() => setStatus('loaded')}
        referrerPolicy="no-referrer"
        width={`${W}`}
        height={`${H}`}
        title="Trailer"
        src={src}></iframe>
      {!status && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            border: '1px solid grey',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          Loading...
        </div>
      )}
    </div>
  );
}

Trailer.propTypes = {};

Trailer.defaultProps = {};

export default React.memo(Trailer);
