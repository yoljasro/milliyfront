import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.sass';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Fooders: React.FC = () => {

  return (
    <div className={styles.fooders}>
       <p className={styles.fooders__title}>Все рестораны</p>   
       <div className={styles.fooders__cards}>
       <div className={styles.fooders__card}>
    <Image className={styles.fooders__img} src={'/assets/img/bowl.png'} alt='fooders1' width={270} height={180} layout="responsive" />
    <p className={styles.fooders__title}>Crazy tacko</p>
    <p className={styles.fooders__desc}>Choose from a variety of bowl options and tas..</p>
    <div className={styles.fooders__timer}>
      <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16}></Image>
      <p>40-50min</p>
    </div>
  </div>

  <div className={styles.fooders__card}>
    <Image className={styles.fooders__img} src={'/assets/img/bowl.png'} alt='fooders1' width={270} height={180} layout="responsive" />
    <p className={styles.fooders__title}>Crazy tacko</p>
    <p className={styles.fooders__desc}>Choose from a variety of bowl options and tas..</p>
    <div className={styles.fooders__timer}>
      <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16}></Image>
      <p>40-50min</p>
    </div>
  </div>

  <div className={styles.fooders__card}>
    <Image className={styles.fooders__img} src={'/assets/img/bowl.png'} alt='fooders1' width={270} height={180} layout="responsive" />
    <p className={styles.fooders__title}>Crazy tacko</p>
    <p className={styles.fooders__desc}>Choose from a variety of bowl options and tas..</p>
    <div className={styles.fooders__timer}>
      <Image alt='timer' src={'/assets/img/timer.svg'} width={16} height={16}></Image>
      <p>40-50min</p>
    </div>
  </div>

       </div>
    </div>
  );
};


