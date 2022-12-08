import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Header from "../../Components/Header";
import styles from "../../styles/ListingId.module.css";
import { useContract, MediaRenderer, useListing } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";

function ListingPage() {
	const router = useRouter();
	const { listingId } = router.query as { listingId: string };

	const { contract } = useContract(
		process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
		"marketplace"
	);

	const { data: listing, isLoading, error } = useListing(contract, listingId);

	const [minimumNextBid, setMinimumNextBid] = React.useState<{
		displayValue: string;
		symbol: string;
	}>();

	useEffect(() => {
		if (!listing || !listingId || !contract) return;

		if (ListingType.Auction) {
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

					<button>Buy Now</button>
				</div>

				{ListingType.Auction && (
					<div>
						<h1>Bid On This Auction: </h1>

						<p>Current Minimum Bid:</p>
						<p>
							{minimumNextBid?.displayValue} {minimumNextBid?.symbol}
						</p>

						<p>Time Remaining:</p>
						<p>...</p>
						<input type='text' placeholder='Enter Value' />
						<button>Place Bid</button>
					</div>
				)}
			</main>
		</div>
	);
}

export default ListingPage;
