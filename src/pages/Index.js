import { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { NotificationContainer } from "react-notifications";
import useInterval from '../libs/useInterval'

// components
import Assets from '../components/Assets'
import Positions from '../components/Positions'
import HunterConfig from '../components/HunterConfig'
import Symbols from '../components/Symbols'

export default function Home() {
  const url = process.env.REACT_APP_API_URL
  const [balance, setBalance] = useState({ Asset: [], Positions: [], AccountPosition: [] });
  const [symbols, setSymbols] = useState([]);
  const [weight, setWeight] = useState(0);

  const fetchBalance = () => {
    axios.get(url + "balance").then((res) => {
      setBalance(res.data);
    });
  };

  const fetchSymbols = () => {
    axios.get(url).then((res) => {
      setSymbols(res.data);
    });
  };

  const fetchWeight = () => {
    axios.get(url + 'safe_to_buy').then((res) => {
      setWeight(res.data);
    });
  };

  useInterval(() => {
    fetchBalance();
    fetchSymbols();
    fetchWeight()
  }, 2000);

  const Round = (string, digit) => {
    if (string) {
      return Math.round(JSON.parse(string) * 10 ** digit) / 10 ** digit
    }
  }

  return (
    <div className="mt-3">
      <Container fluid style={{ padding: "10px 120px" }}>
        <h3 className="text-center">Athea Le | Binance Futures Market Making</h3>

        <Row className="pt-3">
          <Col xs={4}>
            <Assets balance={balance} Round={Round} />
          </Col>
          <Col xs={8}>
            <HunterConfig symbols={symbols} weight={weight} />
          </Col>
        </Row>

        <Row className="pt-1">
          <Col xs={4}>
            <Positions balance={balance} Round={Round} symbols={symbols} />
          </Col>
          <Col xs={8}>
            <Symbols symbols={symbols} weight={weight} />
          </Col>
        </Row>

      </Container >

      <NotificationContainer />
    </div >
  );
}
