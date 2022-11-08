import React from "react";
import styles from "../styles/Components/Header.module.css";
import { AiOutlineBell } from "@react-icons/all-files/ai/AiOutlineBell";
import { AiOutlineShoppingCart } from "@react-icons/all-files/ai/AiOutlineShoppingCart";
import { IconContext } from "@react-icons/all-files/lib";

type Props = {};

function Header({}: Props) {
	return (
		<>
			<header>
				<section className={styles.outerDiv}>
					<div className={styles.wallet}>Hey, 123...321</div>
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
		</>
	);
}

export default Header;
