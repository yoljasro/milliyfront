import Head from "next/head";
import localFont from "next/font/local";
import styles from "../styles/Home.module.css";
import CarouselCards from "components/CarouselCards";
import  Fatest  from "components/Fatest";
import { Popular } from "components/Popular";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900", 
});

export default function Home() {
  return (
    <>
      <Head> 
        <title>NATION FOOD</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <CarouselCards/>
       {/* <Navbar/>
       <CarouselCards/>
       <Balls/>
       <Products/> */}
       {/* <Food/> */}
       {/* <Menu/> */}
       <Fatest/>
       <Popular/>
      </div>
    </>
  );
}
