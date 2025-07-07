import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout/index.jsx"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <>
     <Head>
        <title>LinkElevate - Home</title>
      </Head>
      <UserLayout>
      <div className={styles.container}>
       <div className={styles.maincontainer}>
         <div className={styles.maincontainer_left}>
              <p>Connect with Friends without Exaggeration</p>
              <p>A True Social media platform, with stories no bulfs !</p>
              <div className={styles.buttonJoin} onClick={()=>{router.push("/login")}}>
                <p>Join Now</p>
              </div>
         </div>
         <div className={styles.maincontainer_right}>
           <img src="images/homemain.webp" alt="Connections"
              width={400}
              height={300}></img>
         </div>
       </div>
      </div>
      </UserLayout>
     
    </>
  );
}