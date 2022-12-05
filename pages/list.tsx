import React from "react";
import Header from "../Components/Header";
import styles from "../styles/List.module.css";
import {
	useAddress,
	useContract,
	MediaRenderer,
	useNetwork,
	useNetworkMismatch,
	useOwnedNFTs,
	useCreateAuctionListing,
	useCreateDirectListing,
} from "@thirdweb-dev/react";
import Router from "next/router";

type Props = {};

function List({}: Props) {
	const address = useAddress();

	const { contract } = useContract(
		process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
		"marketplace"
	);

	const { contract: collectionContract } = useContract(
		process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
		"nft-collection"
	);

	const ownedNFTs = useOwnedNFTs(collectionContract, address);

	return (
		<div>
			<Header />
			<main>
				<h1>List an Item</h1>
				<h2>Select an Item</h2>
				<hr />
				<p>Below you'll find all the NFT's you own</p>

				<div>
					{ownedNFTs?.data?.map((nft) => (
						<div key={nft.metadata.id}>
							<MediaRenderer src={nft.metadata.image} />
							<p>{nft.metadata.name}</p>
							<p>{nft.metadata.description}</p>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}

export default List;
