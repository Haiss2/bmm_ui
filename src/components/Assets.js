import { Table } from "react-bootstrap";

const Assets = ({ balance, Round }) => <div>
    <h6>Assets</h6>
    <Table striped bordered borderless responsive>
        <tbody className="text-center">
            <tr>{balance.Asset.map(asset => <td width={300}><b>{asset.Symbol}</b></td>)}</tr>
            <tr>{balance.Asset.map(asset => <td>{Round(asset.Balance, 3)}</td>)}</tr>
            <tr>
                <td><b>Wallet Balance</b></td>
                <td><b>Unrealized PNL</b></td>
                <td><b>Margin Balance</b></td>
            </tr>
            <tr>
                <td>{Round(balance.TotalWalletBalance, 3)}</td>
                <td>{Round(balance.TotalUnrealizedProfit, 3)}</td>
                <td>{Round(balance.TotalMarginBalance, 3)}</td>
            </tr>
        </tbody>
    </Table>
</div>

export default Assets
