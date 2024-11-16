import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PuffLoader } from 'react-spinners'
import styles from './index.module.sass';
import { Spinner } from "react-bootstrap";
import ProgressBar from '../ProgressBar'; // Progress barni import qilish

interface Banner {
  _id: string;
  image: string;
  link: string;
}

const CarouselCards: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(0); // Progress holatini saqlash

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://backmilliy-production.up.railway.app/banners");
        const data: Banner[] = await response.json();

        const updatedBanners = data.map(banner => ({
          ...banner,
          image: `https://backmilliy-production.up.railway.app${banner.image}`
        }));

        setBanners(updatedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
    
    // Progress barni yangilash
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) return prevProgress + 10;
        clearInterval(interval);
        return 100;
      });
    }, 500); // 500 ms da 10% dan oshirish

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
      {loading ? (
       <div className={styles.carouselContainer__loader}>
       <PuffLoader color="#ff7d1a" size={100} />
       <p className={styles.carouselContainer__load}>Загрузка...</p>
       <ProgressBar progress={progress} /> {/* Progress barni yuklash jarayonida ko'rsatish */}
     </div>
      ) : (
        <Slider {...settings}>
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`${styles.card} ${styles.cardAnimation}`}
              onClick={() => handleCardClick(banner.link)}
            >
              <div
                className={styles.cardContent}
                style={{ backgroundImage: `url(${banner.image})` }}
              ></div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CarouselCards;
