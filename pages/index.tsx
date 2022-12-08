import Head from "next/head";
import Header from "../Components/Header";
import styles from "../styles/Home.module.css";
import {
	useActiveListings,
	useContract,
	MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import Link from "next/link";

export default function Home() {
	const { contract } = useContract(
		process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
		"marketplace"
	);
	const { data: listings, isLoading: loadingListings } =
		useActiveListings(contract);

	return (
		<div className={styles.container}>
			<Head>
				<title>NFT Marketplace</title>
				<meta name='description' content='Project Created By Shakanksh Sinha' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Header />
			<main>
				{loadingListings ? (
					<div className={styles.loadingWrapper}>
						<p className={styles.loading}>Loading...</p>
					</div>
				) : (
					<div className={styles.listingWrapper}>
						{listings?.map((listing) => (
							<Link href={`/listing/${listing.id}`} className={styles.listing}>
								<div key={listing.id}>
									<div className={styles.mediaWrapper}>
										<MediaRenderer
											className={styles.media}
											src={listing.asset.image}
										/>
									</div>

									<div className={styles.infoWrapper}>
										<div className={styles.info}>
											<h2 className={styles.heading}>{listing.asset.name}</h2>
											<p className={styles.description}>
												{listing.asset.description}
											</p>
										</div>

										<p className={styles.priceWrapper}>
											<span className={styles.price}>
												{listing.buyoutCurrencyValuePerToken.displayValue}
											</span>
											{listing.buyoutCurrencyValuePerToken.symbol}
										</p>

										<div className={styles.listingTypeWrapper}>
											<p className={styles.listingType}>
												{listing.type === ListingType.Direct
													? "Buy Now"
													: "Bid Now"}
											</p>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
