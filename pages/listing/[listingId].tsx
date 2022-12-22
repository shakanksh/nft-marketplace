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
				<title>{listing.asset.name}</title>
				<meta name='description' content='Project Created By Shakanksh Sinha' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Header />

			<main>
				<div>
					<MediaRenderer src={listing.asset.image} />
				</div>

				<div>
					<h1>{listing.asset.name}</h1>
					<p>{listing.asset.description}</p>
					<p>{listing.sellerAddress}</p>
				</div>

				<div>
					<p>Listing Type: </p>
					<p>
						{listing.type === ListingType.Direct
							? "Direct Listing"
							: "Auction Listing"}
					</p>

					<p>Buy Now Price: </p>
					<p>
						{listing.buyoutCurrencyValuePerToken.displayValue}{" "}
						{listing.buyoutCurrencyValuePerToken.symbol}
					</p>

					<button onClick={buyNft}>Buy Now</button>
				</div>

				{listing.type === ListingType.Auction && (
					<div>
						<h1>Bid On This Auction: </h1>

						<p>Current Minimum Bid:</p>
						<p>
							{minimumNextBid?.displayValue} {minimumNextBid?.symbol}
						</p>

						<p>Time Remaining:</p>
						<Countdown
							date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
						/>
						<input
							onChange={(e) => setBidAmount(e.target.value)}
							type='text'
							placeholder='Enter Value'
						/>
						<button onClick={createBid}>Place Bid</button>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}

export default ListingPage;
