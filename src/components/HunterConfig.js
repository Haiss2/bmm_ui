import { useState, useEffect } from "react";
import useInterval from '../libs/useInterval'
import moment from "moment"
import axios from "axios";

import { Table } from "react-bootstrap";
import { BsArrowClockwise, BsArrowRepeat } from "react-icons/bs";
import { NotificationManager } from "react-notifications";

const InputNumber = ({ setupKey, inputVal, setInputVal, handleKeyDown }) => <input
    type="number" class="form-control text-13px py-0" placeholder="Enter value"
    value={inputVal} onChange={e => setInputVal(e.target.value)}
    onKeyDown={e => handleKeyDown(e, setupKey)}
/>

const HunterConfig = ({ symbols, weight }) => {
    const [cfg, setCfg] = useState({});

    const fetchCfg = () => {
        axios.get(process.env.REACT_APP_API_URL + "hunter_config").then((res) => {
            setCfg(res.data);
        });
    };

    useEffect((() => {
        fetchCfg();
    }), [])

    useInterval(() => {
        fetchCfg();
    }, 30_000); // 30s

    const activeSymbols = symbols.filter(sb => !sb.disabled).length - 1

    const setup = (key, value) => {
        let data = { key, value }
        // process value by key
        if (["symbol_qty", "ht_price_change", "ht_btc_price_diff", "tp_expected_percent", "tp_unexpected_percent", "tp_max_level"].includes(key)) {
            data.value = JSON.parse(value)
        }

        if (key === "ht_snooze_time") {
            data.value = JSON.parse(value) * 60 * 10 ** 9
        }

        axios.post(process.env.REACT_APP_API_URL + "hunter_config", data).then((res) => {
            fetchCfg()
            setShowInput()
            NotificationManager.success(res.data, "Success");
        }).catch(err => {
            NotificationManager.error(err?.response?.data, "Failed")
        });
    }
    const [showInput, setShowInput] = useState()
    const [inputVal, setInputVal] = useState(0);
    const handleKeyDown = (e, key) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            setup(key, inputVal)
        }
    }

    const setupWeight = (e, key) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            axios.get(process.env.REACT_APP_API_URL + "safe_to_buy/" + inputVal).then((res) => {
                setShowInput()
                NotificationManager.success(res.data, "Success");
            }).catch(err => {
                NotificationManager.error(err?.response?.data, "Failed")
            });
        }
    }

    return <div>
        <div className="d-flex justify-content-between">
            <h6>Hunter Configurations</h6>
            <h6 className="fw-light">Hunter Sleep: {moment(cfg.SleepTime).format("DD/MM/YYYY HH:mm:ss")}</h6>
        </div>

        <Table striped bordered borderless responsive>
            <tbody className="text-center">
                <tr>
                    <td width={300}><b>SymbolQty</b></td>
                    <td width={300}><b>HtSnoozeTime</b></td>
                    <td width={300}><b>HtPriceChange</b></td>
                    <td width={300}><b>HtLogOnly</b></td>
                    <td width={300}><b>HtBtcPriceDiff</b></td>
                    <td width={300}><b>Diff</b></td>
                    <td width={300}><b>LastBtcPrice</b></td>
                </tr>
                <tr>
                    <td>
                        {
                            showInput === 'symbol_qty' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="symbol_qty" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('symbol_qty'); setInputVal(cfg.SymbolQty) }}>
                                    {cfg.SymbolQty} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td>
                        {
                            showInput === 'ht_snooze_time' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="ht_snooze_time" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('ht_snooze_time'); setInputVal(cfg.HtSnoozeTime / 60 / 10 ** 9) }}>
                                    {cfg.HtSnoozeTime / 60 / 10 ** 9}m < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td>
                        {
                            showInput === 'ht_price_change' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="ht_price_change" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('ht_price_change'); setInputVal(cfg.HtPriceChange) }}>
                                    {cfg.HtPriceChange} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td><div className="position-relative icon-parent" onClick={() => setup("ht_log_only", !cfg.HtLogOnly)}>
                        <b>{cfg.HtLogOnly ? "Yes" : "No"}</b> <BsArrowRepeat className="custom-icon" />
                    </div></td>

                    <td>
                        {
                            showInput === 'ht_btc_price_diff' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="ht_btc_price_diff" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('ht_btc_price_diff'); setInputVal(cfg.HtBtcPriceDiff) }}>
                                    {cfg.HtBtcPriceDiff} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td>{cfg.Diff}</td>
                    <td>{cfg.LastBtcPrice}</td>
                </tr>
                <tr>
                    <td><b>ActiveSymbols</b></td>
                    <td><b>Weight</b></td>
                    <td><b>OrderTimes</b></td>
                    <td><b>OrderInterval</b></td>
                    <td><b>TpExpectPct</b></td>
                    <td><b>TpUnexpPct</b></td>
                    <td><b>TpMaxLevel</b></td>
                </tr>
                <tr>
                    <td>{activeSymbols}</td>

                    <td>
                        {
                            showInput === 'weight' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={setupWeight} setupKey="weight" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('weight'); setInputVal(weight) }}>
                                    {weight} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td>{cfg.MonitorOrderTimes}</td>
                    <td>{cfg.MonitorOrderInterval / 10 ** 6}ms</td>

                    <td>
                        {
                            showInput === 'tp_expected_percent' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="tp_expected_percent" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('tp_expected_percent'); setInputVal(cfg.TpExpectedPct) }}>
                                    {cfg.TpExpectedPct} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>


                    <td>
                        {
                            showInput === 'tp_unexpected_percent' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="tp_unexpected_percent" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('tp_unexpected_percent'); setInputVal(cfg.TpUnexpectedPct) }}>
                                    {cfg.TpUnexpectedPct} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>

                    <td>
                        {
                            showInput === 'tp_max_level' ?
                                <InputNumber inputVal={inputVal} setInputVal={setInputVal} handleKeyDown={handleKeyDown} setupKey="tp_max_level" /> :
                                <div className="position-relative icon-parent" onClick={() => { setShowInput('tp_max_level'); setInputVal(cfg.TpMaxLevel) }}>
                                    {cfg.TpMaxLevel} < BsArrowClockwise className="custom-icon" /></div>
                        }
                    </td>
                </tr>
            </tbody>
        </Table >
    </div >
}
export default HunterConfig
