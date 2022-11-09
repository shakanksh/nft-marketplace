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
				<div className={styles.search}>
					<input type='text' placeholder='Search' />
				</div>
				<div className={styles.menu}>
					<a href='#'>Create NFT</a>
					<a href='#'>List Item</a>
					<IconContext.Provider
						value={{ size: "1.5em", className: styles.icon }}>
						<AiOutlineBell />
						<AiOutlineShoppingCart />
					</IconContext.Provider>
				</div>
			</section>
			<div></div>
		</header>
	);
}

export default Header;
