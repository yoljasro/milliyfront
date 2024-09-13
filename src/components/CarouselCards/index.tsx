import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './index.module.sass'; // CSS modullarni o'z faylingizga moslang

const CarouselCards: React.FC = () => {
  const settings = {
    dots: true, // Dots qo'shish
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Faqat bitta karta ko'rinadi
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true, // Avtomatik slayder uchun
    autoplaySpeed: 3000, // Slayder tezligi (ms)
    centerMode: true, // Kartani markazda joylashtirish
    centerPadding: "0", // Keyingi karta ko'rinmasligi uchun
  };

  const handleCardClick = (cardId: number) => {
    const url = `https://t.me/unicornapp?card=${cardId}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        <div className={styles.card} onClick={() => handleCardClick(1)} >
        </div>
        <div className={styles.cardtwo} onClick={() => handleCardClick(2)} >
        </div>
        <div className={styles.cardthree} onClick={() => handleCardClick(3)} >
        </div>
        <div className={styles.cardfour} onClick={() => handleCardClick(4)} >
        </div>
      </Slider>
    </div>
  );
};

export default CarouselCards;
