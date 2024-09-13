import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Categories: React.FC = () => {

  return (
    <div className={styles.categories}>
        <p className={styles.categories__title}>Restaurants</p>
      <div className={styles.categories__cont}>
       <div className={styles.categories__content}>
        <p>Категории</p>
        <button>Смотреть все</button>
       </div>
       </div>
    <div className={styles.categories__cards}>
    <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category1.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>

  <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category2.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>

  <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category1.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>

  <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category1.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>

  <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category1.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>

  <div className={styles.categories__card}>
        <div className={styles.categories__item}>
    <Image className={styles.categories__img} src={'/assets/img/category1.png'} alt='categories1' width={135} height={122} layout="responsive" />
    </div>
    <p className={styles.categories__cardtitle}>Brunch  </p>
    <p className={styles.categories__carddesc}>94 places</p>
  </div>
    </div>
    </div>
  );
};


