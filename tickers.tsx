// // pages/tickers.tsx

// // Import any necessary components or types here

// export async function getServerSideProps() {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/api/data/tickers");
//     const tickers = await response.json();

//     return {
//       props: {
//         tickers, // Pass the data as props
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching tickers data:", error);
//     return {
//       props: {
//         tickers: [], // Return an empty array or handle the error case
//       },
//     };
//   }
// }

// export default function TickerPage({ tickers }) {
  
  
  
  
//   return (
//     <div>
//       <h1>Tickers Data</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Symbol</th>
//             <th>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tickers.map((ticker: any, index: number) => (
//             <tr key={index}>
//               <td>{ticker.code}</td>
//               <td>{ticker.name}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
