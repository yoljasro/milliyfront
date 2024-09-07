import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './index.module.sass'; // CSS modullarni o'z faylingizga moslang

const CarouselCards: React.FC = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: false,
    rows: 1,
  };

  const handleCardClick = (cardId: number) => {
    const url = `https://t.me/unicornapp?card=${cardId}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        <div className={styles.card} onClick={() => handleCardClick(1)} >
          <h3 className={styles.title}> 1</h3>
        </div>
        <div className={styles.cardtwo} onClick={() => handleCardClick(2)} >
          <h3 className={styles.title}> 2</h3>
        </div>
        <div className={styles.cardthree} onClick={() => handleCardClick(3)}>
          <h3 className={styles.title}> 3</h3>
        </div>
        <div className={styles.cardfour} onClick={() => handleCardClick(4)}>
          <h3 className={styles.title}> 4</h3>
        </div>
      </Slider>
    </div>
  );
};

export default CarouselCards;
