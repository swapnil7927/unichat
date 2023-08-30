import { useEffect, useRef } from "react";



const ContextMenu = ({ options, coordinates, contextMenu, setContextMenu }) => {

  const contextMenuRef = useRef(null);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    callback();
    setContextMenu(false)
  }

  useEffect(() => {

    const handleOutsideClick = (e) => {
      if (e.target.id !== 'context-opener') {
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
          setContextMenu(false);
        }
      }
    }

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);

  }, []);

  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100]`}
      ref={contextMenuRef}
      style={{
        top: coordinates.y,
        left: coordinates.x
      }
      }
    >
      <ul>
        {
          options.map(({ name, callback }) => (
            <li
              className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
              key={name}
              onClick={e => handleClick(e, callback)}>
              <span className="text-white">{name}</span>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default ContextMenu;