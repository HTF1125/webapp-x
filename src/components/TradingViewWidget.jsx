"use client";

// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({ widgetType, widgetConfig }) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widgetType}.js`;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(widgetConfig);

    const widgetContainer = container.current;
    widgetContainer.innerHTML = ""; // Clear previous content
    widgetContainer.appendChild(script);

    return () => {
      widgetContainer.innerHTML = ""; // Cleanup on unmount
    };
  }, [widgetType, widgetConfig]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '50px' }}
    >
      <div
        className="ticker-scroll"
        style={{
          display: 'flex',
          animation: 'scroll 20s linear infinite',
          whiteSpace: 'nowrap',
          position: 'absolute',
          left: '100%',
        }}
      >
        {/* Placeholder for the TradingView script */}
        <span style={{ paddingRight: '50px' }}>Loading...</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
