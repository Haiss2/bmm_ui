import { Table } from "react-bootstrap";


const cls = (val) => {
    return val.startsWith("-") ? "text-danger" : "text-success"
}
const Positions = ({ balance, symbols, Round }) => {
    let symbolMap = {}
    symbols.forEach(sb => symbolMap[sb.config.symbol] = sb)

    return <div>
        <h6>Positions ({balance.AccountPosition.length})</h6>
        <Table striped bordered borderless responsive>
            <tbody className="text-center">
                <tr>
                    <td style={{ width: "300px" }}><b>PositionInitialMargin</b></td>
                    <td style={{ width: "300px" }}><b>AvailableMargin</b></td>
                </tr>
                <tr>
                    <td>{Round(balance.TotalPositionInitialMargin, 3)}</td>
                    <td>{Round(JSON.parse(balance.TotalMarginBalance || 1) - JSON.parse(balance.TotalPositionInitialMargin || 1), 3)}</td>
                </tr>
            </tbody>
        </Table>

        {balance.AccountPosition.map(pos =>
            <div class="card mb-3" style={{ width: "" }}>
                <div class="card-body row justify-content-between p-2">
                    <div className="text-sm col-4">
                        <h6 className="mb-0">{pos.symbol}</h6>
                        <span className="text-muted">{pos.isolated ? "Isolated" : "Cross"}</span>&nbsp;
                        <span className="text-warning">x{pos.leverage}</span> <span className="text-muted">Qty</span>&nbsp;
                        <span className={cls(pos.positionAmt)}>{JSON.parse(pos.positionAmt || "")}</span>
                    </div>

                    <div className="col-8 d-flex justify-content-between p-auto">
                        <div style={{ width: "35%" }}>
                            <span className="text-tiny text-muted position-absolute top-6px">Entry Price</span>
                            <div style={{ marginTop: "0.75rem" }}>{Round(pos.entryPrice, symbolMap[pos.symbol]?.config?.price_precision || 1)}</div>
                        </div>

                        <div style={{ width: "35%" }}>
                            <span className="text-tiny text-muted position-absolute top-6px">Last Price</span>
                            <div style={{ marginTop: "0.75rem" }}>{symbolMap[pos.symbol]?.price}</div>
                        </div>

                        <div style={{ width: "30%" }}>
                            <span className="text-tiny text-muted position-absolute top-6px">Unrealized Pnl</span>
                            <div style={{ marginTop: "0.75rem" }} className={cls(pos.unrealizedProfit)}>{Round(pos.unrealizedProfit, 3)}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div >
}
export default Positions
