import React, { Suspense } from "react";
import ClientOnly from "@/components/ClientOnly";
const TradingViewWidget = React.lazy(
  () => import("@/components/TradingViewWidget")
);

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<p>Loading market data...</p>}>
        <div className="w-full mb-8">
          <ClientOnly>
            <TradingViewWidget
              widgetType="ticker-tape"
              widgetConfig={{
                symbols: [
                  {
                    title: "S&P500",
                    proName: "CME_MINI:ES1!",
                  },
                  {
                    title: "NASDAQ100",
                    proName: "CME_MINI:NQ1!",
                  },
                  {
                    title: "DJIA30",
                    proName: "CBOT_MINI:MYM1!",
                  },
                  {
                    title: "Russell2",
                    proName: "CME_MINI:RTY1!",
                  },

                  {
                    title: "NIKKIE",
                    proName: "OSE:NK2251!",
                  },
                  {
                    title: "KOREA",
                    proName: "EUREX:FBK21!",
                  },
                  {
                    title: "VIX",
                    proName: "CBOE:VX1!",
                  },
                  {
                    title: "Dollar",
                    proName: "ACTIVTRADES:USDINDZ2024",
                  },
                  {
                    title: "EUR/USD",
                    proName: "FX:EURUSD",
                  },
                  {
                    title: "USD/KRW",
                    proName: "FX_IDC:USDKRW",
                  },
                  {
                    title: "Gold",
                    proName: "COMEX:GC1!",
                  },
                  {
                    title: "WTI",
                    proName: "NYMEX:CL1!",
                  },
                  {
                    proName: "BITSTAMP:BTCUSD",
                    title: "Bitcoin",
                  },
                  {
                    proName: "BITSTAMP:ETHUSD",
                    title: "Ethereum",
                  },
                  {
                    title: "UST",
                    proName: "CBOT:ZB1!",
                  },

                  {
                    title: "US10Y",
                    proName: "CBOT:ZN1!",
                  },
                ],

                scroll: true,
                showSymbolLogo: false,
                colorTheme: "dark",
                isTransparent: true,
                displayMode: "compact",
                locale: "en",
                width: "100%",
                height: 50,
              }}
            />
          </ClientOnly>
        </div>
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <Suspense fallback={<p>Loading events...</p>}>
          <ClientOnly>
            <TradingViewWidget
              widgetType="events"
              widgetConfig={{
                colorTheme: "dark",
                isTransparent: true,
                width: "100%",
                height: "600",
                locale: "en",
                importanceFilter: "-1,0,1",
                countryFilter: "us,eu,gb",
              }}
            />
          </ClientOnly>
        </Suspense>
      </div>
    </div>
  );
}
