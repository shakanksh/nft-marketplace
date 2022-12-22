import {
	MediaRenderer,
	useContract,
	useListing,
	useNetwork,
	useNetworkMismatch,
	useMakeBid,
	useMakeOffer,
	useOffers,
	useBuyNow,
	useAddress,
} from "@thirdweb-dev/react";
import { ChainId, ListingType } from "@thirdweb-dev/sdk";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Countdown from "react-countdown";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import styles from "../../styles/ListingId.module.css";

function ListingPage() {
	const router = useRouter();
	const { listingId } = router.query as { listingId: string };

	const { contract } = useContract(
		process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
		"marketplace"
	);

	const { mutate: buyNow } = useBuyNow(contract);

	const { mutate: makeBid } = useMakeBid(contract);

	const { data: listing, isLoading, error } = useListing(contract, listingId);

	const [bidAmount, setBidAmount] = React.useState("");

	const [, switchNetwork] = useNetwork();
	const networkMismatch = useNetworkMismatch();

	const [minimumNextBid, setMinimumNextBid] = React.useState<{
		displayValue: string;
		symbol: string;
	}>();

	useEffect(() => {
		if (!listing || !listingId || !contract) return;

		if (listing?.type === ListingType.Auction) {
			fetchMinimumBid();
		}
	}, [listing, listingId, contract]);

	const fetchMinimumBid = async () => {
		if (!contract || !listingId) return;

		const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
			listingId
		);
		setMinimumNextBid({
			displayValue: displayValue,
			symbol: symbol,
		});
	};

	const buyNft = async () => {
		if (networkMismatch) {
			switchNetwork && switchNetwork(ChainId.Mumbai);
			return;
		}

		if (!listing || !listingId || !contract) return;

		await buyNow(
			{
				id: listingId,
				buyAmount: 1,
				type: listing.type,
			},
			{
				onSuccess(data, variables, context) {
					console.log("Success", data);
					alert("NFT Bought");
					router.replace("/");
				},
				onError(error, variables, context) {
					console.log("Error: NFT not bought");
					alert("Error");
				},
			}
		);
	};

	const createBid = async () => {
		try {
			if (networkMismatch) {
				switchNetwork && switchNetwork(ChainId.Mumbai);
				return;
			}

			if (listing?.type === ListingType.Auction) {
				await makeBid(
					{
						listingId,
						bid: bidAmount,
					},
					{
						onSuccess(data, variables, context) {
							console.log("Success", data);
							alert("Bid Created");
							setBidAmount("");
						},
						onError(error, variables, context) {
							console.log("Error: Bid not created");
							alert("Error");
						},
					}
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading)
		return (
			<div>
				<Header />
				<p>Loading Item....</p>
			</div>
		);

	if (!listing) {
		return (
			<div>
				<Header />
				<p>Item not found</p>
			</div>
		);
	}

	return (
		<div>
			<Head>
				<title>{listing.asset.name} - NFT</title>
				<meta name='description' content='Project Created By Shakanksh Sinha' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Header />

			<main className={styles.main}>
				<div className={styles.imageWrapper}>
					<MediaRenderer className={styles.image} src={listing.asset.image} />
				</div>

				<section>
					<h1>{listing.asset.name}</h1>

					<div className={styles.details}>
						<p className={styles.label}>Description: </p>
						<p>{listing.asset.description}</p>
						<p className={styles.label}>Seller: </p>
						<p>
							{listing.sellerAddress.slice(0, 7)}...
							{listing.sellerAddress.slice(-7)}
						</p>

						<p className={styles.label}>Listing Type: </p>
						<p>
							{listing.type === ListingType.Direct
								? "Direct Listing"
								: "Auction Listing"}
						</p>

						<p className={styles.label}>Buy Now Price: </p>
						<p>
							{listing.buyoutCurrencyValuePerToken.displayValue}{" "}
							{listing.buyoutCurrencyValuePerToken.symbol}
						</p>
					</div>
					<button onClick={buyNft}>Buy Now</button>

					{listing.type === ListingType.Auction && (
						<div>
							<h1>Auction Details</h1>

							<div className={styles.details}>
								<p className={styles.label}>Current Minimum Bid:</p>
								<p>
									{minimumNextBid?.displayValue} {minimumNextBid?.symbol}
								</p>

								<p className={styles.label}>Time Remaining:</p>
								<Countdown
									date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
								/>
								<p className={styles.label}>Bid On This Auction: </p>
								<div className={styles.inputField}>
									<input
										onChange={(e) => setBidAmount(e.target.value)}
										type='text'
										placeholder='Enter Value'
									/>
								</div>
							</div>
							<button onClick={createBid}>Place Bid</button>
						</div>
					)}
				</section>
			</main>
			<Footer />
		</div>
	);
}

export default ListingPage;
