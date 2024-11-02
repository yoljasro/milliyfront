import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './index.module.sass'; // CSS modullarni o'z faylingizga moslang

interface Banner {
  _id: string;
  image: string;
  link: string;
}

const CarouselCards: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://backmilliy-production.up.railway.app/banners");
        const data: Banner[] = await response.json();
        
        // Rasm URL-larini to'liq URL ga aylantirish
        const updatedBanners = data.map(banner => ({
          ...banner,
          image: `https://backmilliy-production.up.railway.app${banner.image}`
        }));

        setBanners(updatedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0",
  };

  const handleCardClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className={styles.card} onClick={() => handleCardClick(banner.link)}>
            <div
              className={styles.cardContent}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              {/* Agar sizga rasm ustida matn ko'rsatish kerak bo'lsa, bu yerga qo'shishingiz mumkin */}
              {/* <div className={styles.title}>{banner.title}</div> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselCards;
