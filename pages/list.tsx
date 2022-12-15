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
import {
	ChainId,
	NFT,
	NATIVE_TOKENS,
	NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";

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

	const router = Router;

	const ownedNFTs = useOwnedNFTs(collectionContract, address);

	const [selectedNFT, setSelectedNFT] = React.useState<NFT>();

	const networkMismatch = useNetworkMismatch();

	const [, switchNetwork] = useNetwork();

	const {
		mutate: createDirectListing,
		isLoading: isLoadingDirect,
		error: errorDirect,
	} = useCreateDirectListing(contract);

	const {
		mutate: createAuctionListing,
		isLoading: isLoading,
		error: error,
	} = useCreateAuctionListing(contract);

	const handleListing = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (networkMismatch) {
			switchNetwork && switchNetwork(ChainId.Mumbai);
			return;
		}
		if (!selectedNFT) return;

		const target = e.target as typeof e.target & {
			elements: { listingType: { value: string }; price: { value: string } };
		};

		const { listingType, price } = target.elements;

		if (listingType.value === "directListing") {
			createDirectListing(
				{
					assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
					tokenId: selectedNFT.metadata.id,
					currencyContractAddress: NATIVE_TOKEN_ADDRESS,
					listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
					buyoutPricePerToken: price.value,
					quantity: 1,
					startTimestamp: new Date(),
				},
				{
					onSuccess(data, variables, context) {
						console.log("success", data, variables, context);
						router.push("/");
					},
					onError(error, variables, context) {
						console.log("error", error, variables, context);
					},
				}
			);
		}

		if (listingType.value === "auctionListing") {
			createAuctionListing(
				{
					assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
					buyoutPricePerToken: price.value,
					tokenId: selectedNFT.metadata.id,
					startTimestamp: new Date(),
					currencyContractAddress: NATIVE_TOKEN_ADDRESS,
					listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
					quantity: 1,
					reservePricePerToken: 0,
				},
				{
					onSuccess(data, variables, context) {
						console.log("success", data, variables, context);
						router.push("/");
					},
					onError(error, variables, context) {
						console.log("error", error, variables, context);
					},
				}
			);
		}
	};

	return (
		<div className={styles.container}>
			<Header />
			<main>
				<h1>List an Item</h1>
				{/* <h2>Select an Item</h2> */}
				<hr />
				<p className={styles.infoText}>
					Below you'll find all the NFT's you own
				</p>

				<div className={styles.listingWrapper}>
					{ownedNFTs?.data?.map((nft) => (
						<div
							className={
								nft.metadata.id === selectedNFT?.metadata.id
									? styles.selected
									: styles.listing
							}
							key={nft.metadata.id}
							onClick={() => setSelectedNFT(nft)}>
							<div className={styles.mediaWrapper}>
								<MediaRenderer
									className={styles.media}
									src={nft.metadata.image}
								/>
							</div>
							<div className={styles.infoWrapper}>
								<div className={styles.info}>
									<h2 className={styles.heading}>{nft.metadata.name}</h2>
									<p className={styles.description}>
										{nft.metadata.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{selectedNFT && (
					<form className={styles.formWrapper} onSubmit={handleListing}>
						<div>
							<div className={styles.form}>
								<label className={styles.label}>Direct Listing :</label>
								<input
									className={styles.radio}
									type='radio'
									name='listingType'
									value='directListing'
								/>
								<label className={styles.label}>Auction :</label>
								<input
									className={styles.radio}
									type='radio'
									name='listingType'
									value='auctionListing'
								/>
								<label className={styles.label}>Price :</label>
								<div className={styles.inputField}>
									<input type='text' name='price' placeholder='0.05' />
								</div>
							</div>
							<button type='submit'>List Item</button>
						</div>
					</form>
				)}
			</main>
		</div>
	);
}

export default List;
