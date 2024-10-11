import TickersClient from './TickersClient';
import { fetchTickers, Ticker } from "./api";

export default async function TickersPage() {
  const initialTickers = await fetchTickers();
  return <TickersClient initialTickers={initialTickers} />;
}