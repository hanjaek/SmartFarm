import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen flex flex-col items-center text-center p-6">
      {/* 헤더 */}
      <header className="w-full max-w-4xl mt-10">
        <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-md">
          🌱 My Smart Farm
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          자연과 기술이 만나는 곳, 스마트하게 농작물을 관리하세요!
        </p>
      </header>

      {/* 소개 이미지 */}
      <div className="mt-10">
        <img 
          src="https://source.unsplash.com/600x300/?farm,technology" 
          alt="Smart Farm" 
          className="rounded-xl shadow-lg border border-green-300"
        />
      </div>

      {/* 주요 기능 설명 */}
      <div className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-400 text-left">
          <h2 className="text-2xl font-bold text-green-600">📊 실시간 모니터링</h2>
          <p className="text-gray-700 mt-2">
            온도, 습도, 조도 정보를 실시간으로 확인하고 환경 변화를 추적하세요.
          </p>
        </div>
        <div className="mt-12 flex gap-6">
        <Link to="/monitoring" className="px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-green-700 transition">
          모니터링 보기
        </Link>
      </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400 text-left">
          <h2 className="text-2xl font-bold text-yellow-600">💡 원격 제어</h2>
          <p className="text-gray-700 mt-2">
            원격으로 전구를 켜고 끄며, 스마트팜을 편리하게 관리할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 페이지 이동 버튼 */}
      <div className="mt-12 flex gap-6">
        <Link to="/control" className="px-6 py-3 bg-yellow-500 text-white text-lg font-bold rounded-full shadow-lg hover:bg-yellow-600 transition">
          전구 제어하기
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
