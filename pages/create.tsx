import React from "react";
import Header from "../Components/Header";
import styles from "../styles/Create.module.css";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Router from "next/router";

type Props = {};

function create({}: Props) {
	const address = useAddress();

	const [preview, setPreview] = React.useState<string>();
	const [image, setImage] = React.useState<File>();
	const [name, setName] = React.useState<string>("");
	const [description, setDescription] = React.useState<string>("");

	const { contract } = useContract(
		process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
		"nft-collection"
	);

	const mintNft = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!contract || !address) return;

		if (!image) {
			alert("Please select an image");
			return;
		}

		const target = e.target as typeof e.target & {
			name: { value: string };
			description: { value: string };
		};

		const metaData = {
			name: target.name.value,
			description: target.description.value,
			image: image,
		};

		try {
			const transaction = await contract.mintTo(address, metaData);
			Router.push("/");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Header />

			<main className={styles.main}>
				<h1 className={styles.heading}>
					<span>Add an Item to the</span> Marketplace
				</h1>
				<h2>
					Item <span>Details</span>
				</h2>
				<p>
					By adding an Item to the Marketplace, you're essentially Minting an
					NFT of the Item into your Wallet which we can then List for Sale or
					Auction
				</p>
				<hr />

				<div className={styles.formWrapper}>
					<img src={preview} alt='' />
					<form onSubmit={mintNft} className={styles.form}>
						<label>Name of the Item</label>
						<input type='text' name='name' id='name' />
						<label>Item Description</label>
						<input type='text' name='description' id='description' />
						<label>Image of the Item</label>
						<input
							type='file'
							onChange={(e) => {
								if (e.target.files?.[0]) {
									setPreview(URL.createObjectURL(e.target.files[0]));
									setImage(e.target.files[0]);
								}
							}}
						/>
						<button type='submit'>Add/Mint Item</button>
					</form>
				</div>
			</main>
		</div>
	);
}

export default create;
