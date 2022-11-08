import Head from "next/head";
import Header from "../Components/Header";
import styles from "../styles/Home.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>NFT Marketplace</title>
				<meta name='description' content='Project Created By Shakanksh Sinha' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Header />
		</div>
	);
}
