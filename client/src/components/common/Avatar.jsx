import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";


const Avatar = ({ type, image, setImage }) => {

  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({
      x: e.pageX,
      y: e.pageY,
    })
  }

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true);
      }
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      }
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      }
    },
    {
      name: "Remove",
      callback: () => {
        setImage('/default_avatar.png');
      }
    }
  ]

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = (e) => {
      data.src = e.target.result;
      data.setAttribute("data-src", e.target.result);
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src)
    }, 100);
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker');
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      }
    }

  }, [grabPhoto]);


  return (
    <>
      <div className="flex items-center justify-center">

        {type === 'sm' && (
          <div className="relative h-10 w-10">
            <img src={image} alt="avatar" className="rounded-full" />
          </div>
        )}
        {type === 'lg' && (
          <div className="relative h-14 w-14">
            <img src={image} alt="avatar" className="rounded-full" />
          </div>
        )}
        {type === 'xl' && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div
              className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center justify-center flex-col text-center gap-2 ${hover ? "visible" : "hidden"} z-10 rounded-full`}
              onClick={e => showContextMenu(e)}
              id="context-opener"
            >
              <FaCamera
                onClick={e => showContextMenu(e)}
                id="context-opener"
                className="text-2xl" />
              <span
                onClick={e => showContextMenu(e)}
                id="context-opener"
              >
                Change Profile Photo
              </span>
            </div>
            <div className="h-60 w-60 flex items-center justify-center">
              <img src={image} alt="avatar" className="rounded-full" />
            </div>
          </div>
        )}
      </div>
      {
        isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )
      }
      {
        showCapturePhoto &&
        <CapturePhoto
          setImage={setImage}
          hide={setShowCapturePhoto}
        />
      }
      {
        showPhotoLibrary &&
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      }
      {
        grabPhoto &&
        <PhotoPicker
          onChange={photoPickerChange}
        />
      }

    </>
  );
}

export default Avatar;