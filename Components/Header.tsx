import React from "react";
import styles from "../styles/Components/Header.module.css";
import { AiOutlineBell } from "@react-icons/all-files/ai/AiOutlineBell";
import { AiOutlineShoppingCart } from "@react-icons/all-files/ai/AiOutlineShoppingCart";
import { IconContext } from "@react-icons/all-files/lib";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
	const connectWithMetaMask = useMetamask();
	const disconnect = useDisconnect();
	const address = useAddress();

	return (
		<header>
			<section className={styles.outerDiv}>
				{address ? (
					<button onClick={disconnect} className={styles.wallet}>
						Hey, {address.slice(0, 4)}...{address.slice(-4)}
					</button>
				) : (
					<button onClick={connectWithMetaMask} className={styles.wallet}>
						Connect Your Wallet
					</button>
				)}
				<div className={styles.logo}>
					{/* <input type='text' placeholder='Search' /> */}
					<a href='/'>
						<h1>CrytoPunk</h1>
					</a>
				</div>
				<div className={styles.menu}>
					<a href='/create'>Create NFT</a>
					<a href='/list'>List Item</a>
				</div>
			</section>
			<div></div>
		</header>
	);
}

export default Header;
