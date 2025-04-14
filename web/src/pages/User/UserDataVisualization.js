import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function UserDataVisualization() {
  const [sensorData, setSensorData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("7days");
  const [chartHeight, setChartHeight] = useState(100); // 기본 높이 설정

  // 화면 크기에 따른 차트 높이 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // 모바일 화면 크기
        setChartHeight(200); // 모바일에서 차트 높이를 200으로 설정
      } else { // 데스크탑 화면 크기
        setChartHeight(100); // 데스크탑에서 차트 높이를 100으로 설정
      }
    };

    handleResize(); // 초기 화면 크기 설정
    window.addEventListener("resize", handleResize); // 화면 크기 변경 시 처리

    return () => window.removeEventListener("resize", handleResize); // 컴포넌트 언마운트 시 이벤트 제거
  }, []); // 빈 배열을 넣어 최초 한 번만 실행되도록 수정

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/sensor-data?timeFrame=${timeFrame}`, {
          method: "GET",
          credentials: "include",  // 쿠키 포함
        });
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  const labels = sensorData.map((entry) => entry.date);
  const temperatures = sensorData.map((entry) => entry.temperature);
  const humidities = sensorData.map((entry) => entry.humidity);
  const moistures = sensorData.map((entry) => entry.moisture);

  const temperatureChart = {
    labels,
    datasets: [
      {
        label: "온도(°C)",
        data: temperatures,
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const humidityChart = {
    labels,
    datasets: [
      {
        label: "습도(%)",
        data: humidities,
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const moistureChart = {
    labels,
    datasets: [
      {
        label: "토양 수분(%)",
        data: moistures,
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">📊 환경 그래프</h2>

      <Row className="mb-4">
        <Col md={12} className="text-center">
          <Button
            variant={timeFrame === "7days" ? "success" : "outline-success"}
            onClick={() => setTimeFrame("7days")}
            className="mx-2 btn-lg"
          >
            7일 데이터
          </Button>
          <Button
            variant={timeFrame === "30days" ? "success" : "outline-success"}
            onClick={() => setTimeFrame("30days")}
            className="mx-2 btn-lg"
          >
            30일 데이터
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-danger mb-3">🌡️ 온도 변화</h5>
              <Line data={temperatureChart} height={chartHeight} options={{ responsive: true }} />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-info mb-3">💧 습도 변화</h5>
              <Line data={humidityChart} height={chartHeight} options={{ responsive: true }} />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-teal mb-3">🌱 토양 수분 변화</h5>
              <Line data={moistureChart} height={chartHeight} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDataVisualization;
