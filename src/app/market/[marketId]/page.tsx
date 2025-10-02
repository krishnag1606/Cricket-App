import { Header } from "@/components/header";
import { MarketClient } from "@/components/market/market-client";
import { MARKETS } from "@/lib/constants";
import type { MarketId } from "@/lib/types";

export default function MarketPage({ params }: { params: { marketId: MarketId }}) {
  const market = MARKETS[params.marketId];

  if (!market) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Market Not Found" />
        <main className="flex-1 flex items-center justify-center">
          <p>The market you are looking for does not exist.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={market.name} />
      <MarketClient marketId={params.marketId} />
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(MARKETS).map((marketId) => ({
    marketId,
  }));
}
