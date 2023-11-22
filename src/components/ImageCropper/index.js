import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "./ImgCropper.scss";
import getCroppedImg from "./CroppedImg";
import Button from "components/Button";

const ImageCropper = ({ image, updateCroppedImg, cancelCrop, file }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const name = file?.name;
  const type = file?.type;

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
        name,
        type
      );
      updateCroppedImg(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const cancelButton = () => {
    cancelCrop();
  };
  return (
    <div className="cropper">
      <div className="crop-container">
        <Cropper
          image={image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <div className="controls__input">
          <label>Zoom: </label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
            className="zoom-range"
          />
        </div>

        {/* <div className="controls__input">
          <label>Rotation : </label>
          <input
            type="range"
            value={rotation}
            min={0}
            max={360}
            step={10}
            aria-labelledby="Rotation"
            onChange={(e) => {
              setRotation(e.target.value);
            }}
            className="zoom-range"
          />
        </div> */}
      </div>

      <div className="cropperButton">
        <Button
          title={"Cancel"}
          className={"button--border"}
          onClick={cancelButton}
        />
        <Button
          title={"Crop"}
          className={"button--blue ms-3"}
          onClick={showCroppedImage}
        />
      </div>
    </div>
  );
};

export default ImageCropper;
