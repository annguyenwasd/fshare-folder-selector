import React, { useState, useRef } from 'react';
import { getSize, getFileName, removeIframes } from 'utils';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import Trailer from 'components/trailer';

function File({ onChange, file, className, checked }) {
  const [isPopoverOpen, setOpen] = useState(false);
  const popover = useRef();

  return (
    <div className={`${className} ${isPopoverOpen ? 'watching-trailer' : ''}`}>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        &nbsp;
        {file.name} - {getSize(file.size)}
        <a
          href={`https://fshare.vn/file/${file.linkcode}`}
          target="_blank"
          rel="noopener noreferrer">
          Go to file
        </a>
        <button style={{ marginLeft: 10, cursor: 'pointer' }}>
          <Popover
            ref={popover}
            onClickOutside={e => {
              e.preventDefault();
              setOpen(false);
            }}
            isOpen={isPopoverOpen}
            position={'top'} // preferred position
            content={({ position, targetRect, popoverRect }) => (
              <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                position={position}
                targetRect={targetRect}
                popoverRect={popoverRect}
                arrowColor={'black'}
                arrowSize={10}
                arrowStyle={{ opacity: 1 }}>
                <Trailer
                  src={`https://www.youtube.com/embed?listType=search&list=${getFileName(
                    file
                  )} trailer`}
                />
              </ArrowContainer>
            )}>
            <div
              onClick={e => {
                e.preventDefault();
                setOpen(!isPopoverOpen);
              }}>
              Watch trailer
            </div>
          </Popover>
        </button>
      </label>
    </div>
  );
}

File.propTypes = {};

File.defaultProps = {};

export default File;
