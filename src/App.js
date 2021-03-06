import React from "react";
import './App.css';

const ws = new WebSocket('wss://production-esocket.delta.exchange.');
function App() {
    const [data, setData] = React.useState([]);
    const [symbol, setSymbol] = React.useState([]);
    React.useEffect( () => {
         fetch("https://api.delta.exchange/v2/products")
            .then((res) => res.json())
            .then((res) => {
                setData(res.result);
                // dd = [...res.result];
                let temp = [...res.result];
                setSymbol(temp.map(item => item['symbol']));
            });
    }, []);
    React.useEffect(async () => {


        ws.onopen = (event) => {
            ws.send(JSON.stringify({
                "type": "subscribe",
                "payload": {
                    "channels": [
                        {
                            "name": "v2/ticker",
                            "symbols": [
                                ...symbol
                            ]
                        }

                    ]
                }
            }));
        };
        ws.onmessage = function (event) {
            const jsn = JSON.parse(event.data);
            try {
                
                if ((jsn.mark_price) && [...data].length > 0) {

                    document.getElementById('' + jsn.symbol).innerHTML = "" + jsn.mark_price;
                    //console.log(document.getElementById('' + jsn.symbol).innerHTML);
                    
                }

            } catch (err) {
                debugger
                console.log(err);
            }
        };

        //clean up function
        //return () => ws.close();
    }, [symbol]);
  return (
      <><table>
          <thead>
              <tr>
                  <th>Symbol</th>
                  <th>Description</th>
                  <th>Underlying Asset</th>
                  <th>Mark Price</th>
              </tr>
          </thead>
          <tbody>
              {data.map(item => <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td>{item.description}</td>
                  <td>{item.underlying_asset.symbol}</td>
                  <td id={'' + item.symbol} key={item.symbol + item.id}>loading...</td>
              </tr>)}
          </tbody>
      </table>
      </>
  );
}

export default App;
