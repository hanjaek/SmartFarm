function Settings() {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center md:text-left">⚙️ 설정</h2>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-lg font-medium text-gray-700 mb-3">🔔 알림 설정</h3>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700 text-lg">온습도 이상 시 알림 받기</span>
          </label>
        </div>
      </div>
    );
  }
  
  export default Settings;
  