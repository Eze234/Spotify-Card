import React from 'react';
import '@assets/css/preview.css';

type CardProps = {
  image: string;
  name: string;
  link: string;
};

const Card: React.FC<CardProps> = ({ image, name, link }) => {
  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={image} alt={name} className="card-image" />
      <h3 className="card-title">{name}</h3>
    </div>
  );
};

export default Card;
