// App.jsx
import React from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Investment-X</h1>
      <p className="text-xl mb-8 text-center">
        Advanced investment research and strategy platform
      </p>

      <div className="space-y-4 mb-8">
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>

      <div className="w-full mb-8">
        <TradingViewWidget
          widgetType="ticker-tape"
          widgetConfig={{
            symbols: [
              { proName: "FOREXCOM:SPXUSD", title: "S&P500" },
              { proName: "FOREXCOM:NSXUSD", title: "Nasdaq100" },
              { proName: "FOREXCOM:US30", title: "DJIA30" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "FOREXCOM:JP225", title: "Nikkei225" },
              { proName: "INDEX:000001", title: "Rus2000" },
              { proName: "INDEX:000001", title: "Rus2000" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "CAPITALCOM:RTY", title: "Rus2000" },
              { proName: "FX_IDC:USDKRW", title: "KRW/USD" },
              { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
            ],
            scroll: true,
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            displayMode: "compact",
            locale: "en",
            width: '100%', // Ensure full width
            height: 50, // Adjust height as needed
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <TradingViewWidget
          widgetType="events"
          widgetConfig={{
            colorTheme: "light",
            isTransparent: false,
            width: "100%",
            height: "600",
            locale: "en",
            importanceFilter: "-1,0,1",
            countryFilter: "us,eu,gb",
          }}
        />

        <TradingViewWidget
          widgetType="stock-heatmap"
          widgetConfig={{
            exchanges: ["US"],
            dataSource: "SPX500",
            grouping: "sector",
            blockSize: "market_cap_basic",
            blockColor: "change",
            locale: "en",
            symbolUrl: "",
            colorTheme: "light",
            hasTopBar: false,
            isDataSetEnabled: false,
            isZoomEnabled: true,
            hasSymbolTooltip: true,
            width: "100%",
            height: "400",
          }}
        />

        <TradingViewWidget
          widgetType="forex-heat-map"
          widgetConfig={{
            width: "100%",
            height: "400",
            currencies: [
              "EUR",
              "USD",
              "JPY",
              "GBP",
              "CHF",
              "AUD",
              "CAD",
              "NZD",
              "CNY",
            ],
            isTransparent: false,
            colorTheme: "light",
            locale: "en",
          }}
        />

        <TradingViewWidget
          widgetType="news"
          widgetConfig={{
            title: "Latest Financial News",
            width: "100%",
            height: "400",
            locale: "en",
            urlNewsFeed:
              "https://news.google.com/rss/search?q=financial&hl=en-US&gl=US&ceid=US%3Aen",
          }}
        />

        <TradingViewWidget
          widgetType="market-overview"
          widgetConfig={{
            colorTheme: "light",
            dateRange: "12M",
            showChart: true,
            locale: "en",
            largeChartUrl: "",
            isTransparent: false,
            showSymbolLogo: true,
            showFloatingTooltip: false,
            width: "100%",
            height: "400",
            tabs: [
              {
                title: "Indices",
                symbols: [
                  { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                  { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
                  { s: "FOREXCOM:DJI", d: "Dow 30" },
                  { s: "INDEX:NKY", d: "Nikkei 225" },
                  { s: "INDEX:DEU30", d: "DAX Index" },
                  { s: "FOREXCOM:UKXGBP", d: "FTSE 100" },
                ],
                originalTitle: "Indices",
              },
              {
                title: "Commodities",
                symbols: [
                  { s: "CME_MINI:ES1!", d: "S&P 500" },
                  { s: "CME:6E1!", d: "Euro" },
                  { s: "COMEX:GC1!", d: "Gold" },
                  { s: "NYMEX:CL1!", d: "Crude Oil" },
                  { s: "NYMEX:NG1!", d: "Natural Gas" },
                  { s: "CBOT:ZC1!", d: "Corn" },
                ],
                originalTitle: "Commodities",
              },
              {
                title: "Bonds",
                symbols: [
                  { s: "CME:GE1!", d: "Eurodollar" },
                  { s: "CBOT:ZB1!", d: "T-Bond" },
                  { s: "CBOT:UB1!", d: "Ultra T-Bond" },
                  { s: "EUREX:FGBL1!", d: "Euro Bund" },
                  { s: "EUREX:FBTP1!", d: "Euro BTP" },
                  { s: "EUREX:FGBM1!", d: "Euro BOBL" },
                ],
                originalTitle: "Bonds",
              },
              {
                title: "Forex",
                symbols: [
                  { s: "FX:EURUSD" },
                  { s: "FX:GBPUSD" },
                  { s: "FX:USDJPY" },
                  { s: "FX:USDCHF" },
                  { s: "FX:AUDUSD" },
                  { s: "FX:USDCAD" },
                ],
                originalTitle: "Forex",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
