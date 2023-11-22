import { CreditIcons } from "assets/images";
import React from "react";

const CardIcons = ({ mainClass, cardsContainerClass, imgClass, imgSrc }) => {
  return (
    <div className={mainClass}>
      <div className={cardsContainerClass}>
        <img
          src={imgSrc ? imgSrc : CreditIcons}
          alt="Mastercard, Visa, American Express"
          className={imgClass}
        />
      </div>
    </div>
  );
};

export default CardIcons;
