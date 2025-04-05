import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

function DataVisualization() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([20, 22, 24, 26, 23, 25, 27]); // 샘플 데이터
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">📊 데이터 시각화</h2>
      <Card className="shadow-lg border-0 p-4">
        <h5 className="fw-bold text-primary mb-3">📈 온도 변화</h5>
        <div style={{ height: "300px" }}>
          <Line
            data={{
              labels: ["12PM", "1PM", "2PM", "3PM", "4PM"],
              datasets: [
                {
                  label: "온도(°C)",
                  data,
                  borderColor: "#34D399",
                  backgroundColor: "rgba(52, 211, 153, 0.2)",
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { type: "category" },
                y: { beginAtZero: true },
              },
              plugins: {
                legend: { display: true, position: "top" },
              },
            }}
          />
        </div>
      </Card>
    </Container>
  );
}

export default DataVisualization;
