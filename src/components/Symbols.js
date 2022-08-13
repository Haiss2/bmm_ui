import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

const Symbols = ({ symbols, weight }) => {
  const url = process.env.REACT_APP_API_URL

  const round = (val, exp) => {
    return Math.round(val * 10 ** exp) / 10 ** exp
  }

  const setEnaDisable = (symbol, disabled) => {
    axios.get(`${url}${disabled ? 'enable' : 'disable'}/${symbol}`).then(res => {
      NotificationManager.success(res.data, "Success");
    }).catch(err => {
      NotificationManager.error(err?.response?.data, "Failed")
    })
  }

  const calcWeight = (current, w, h) => {
    if (h - w > 0) {
      return round((h - current) / (h - w), 2)
    }
  }

  const cls = (val) => {
    return val >= 0 ? "text-success" : "text-danger"
  }

  const hideBtc = (s) => {
    return s === "BTCUSDT" ? " d-none " : ""
  }

  return <div>
    <h6>Symbols ({symbols.length - 1})</h6>
    <Row>
      {symbols.map(sb => {
        let weighted = calcWeight(sb.price, sb.historical.weightedAvgPrice, sb.historical.highPrice)
        return < Col xs={3} className="pb-3" >
          <div class="card h-100" style={{ width: "" }}>
            <div class="card-body p-2">
              <div className="d-flex justify-content-between text-14px px-2">
                <div>
                  <h6 class="card-title">{sb.config.symbol}</h6>
                  <h5 className="ms-2">{sb.price}</h5>
                  <div className={hideBtc(sb.config.symbol)}>
                    <div className="text-muted text-tiny">24h Low: {sb.historical.lowPrice}</div>
                    <div className="text-muted text-tiny">24h Weight: {round(sb.historical.weightedAvgPrice, sb.config.price_precision)}</div>
                    <div className="text-muted text-tiny">24h High: {sb.historical.highPrice}</div>
                  </div>
                  {
                    sb.config.symbol === "BTCUSDT" && <div className="text-muted text-tiny">
                      BTCUSDT is the leading contract.<br />The bmm bot will not automatically trade for this symbol.</div>
                  }
                </div>
                <div className={"text-end pt-1 text-sm" + hideBtc(sb.config.symbol)}>
                  <div>10m <span className={cls(sb.tenMinChange)}>{round(sb.tenMinChange, 2)}%</span></div>
                  <div>24h <span className={cls(sb.historical.priceChangePercent)}>{round(sb.historical.priceChangePercent, 2)}%</span></div>
                  {/* <div>7d <span className={cls(0)}>{round(0, 2)}%</span></div> */}
                </div>
              </div>

              {/* Symbol footer */}
              <div className={"d-flex justify-content-between text-14px px-2" + hideBtc(sb.config.symbol)}>
                <div className={sb.traded ? 'text-danger' : 'text-success'}>
                  {sb.traded ? "Traded" : "Free"}
                </div>

                <div className={weighted < weight ? 'text-danger' : 'text-success'}>
                  W-{weighted}
                </div>

                <div
                  style={{ cursor: "pointer" }}
                  className={sb.disabled ? 'text-danger' : 'text-success'}
                  onClick={() => setEnaDisable(sb.config.symbol, sb.disabled)}>
                  {sb.disabled ? "Disabled" : <span>Enabled</span>}
                </div>
              </div>
            </div>
          </div>
        </Col>
      }

      )}
    </Row>
  </div >
}

export default Symbols
