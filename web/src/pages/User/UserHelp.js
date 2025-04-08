import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";

function Help() {
  return (
    <Container className="py-5">
      <h2 className="text-center text-success fw-bold mb-4">❓ 도움말</h2>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>💡 스마트팜이란?</Accordion.Header>
          <Accordion.Body>
            스마트팜은 IoT 센서를 활용하여 실시간으로 환경을 감지하고 자동으로 농업을 관리하는 시스템입니다.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>📈 데이터 시각화 기능은 어떻게 사용하나요?</Accordion.Header>
          <Accordion.Body>
            "데이터" 페이지에서 실시간 환경 정보를 그래프로 확인할 수 있습니다.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>🔧 시스템 설정을 변경하려면?</Accordion.Header>
          <Accordion.Body>
            "설정" 메뉴에서 알림 및 자동화 기능을 조정할 수 있습니다.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default Help;
