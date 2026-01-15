import { useState, useEffect } from 'react';
import logoImg from './assets/logo.png';
import modelImg from './assets/model_fix.png';
import bgImg from './assets/bg.png';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    expiryYear: '',
    expiryMonth: '',
    agreement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 가입 절차 스텝 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 실시간 상담 접수 목록 (더미 데이터)
  const recentConsults = [
    { name: '김*수', type: '인터넷 가입', status: '상담완료', time: '방금 전' },
    { name: '이*영', type: '요금제 변경', status: '접수완료', time: '2분 전' },
    { name: '박*호', type: '결합 문의', status: '상담완료', time: '5분 전' },
    { name: '최*민', type: '인터넷 가입', status: '접수완료', time: '8분 전' },
    { name: '정*아', type: '요금제 변경', status: '상담완료', time: '12분 전' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if(!formData.agreement) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    if(!formData.name || !formData.phone) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        phone: formData.phone,
        expiryDate: formData.expiryYear === '만기완료' 
          ? '만기완료' 
          : (formData.expiryYear && formData.expiryMonth 
              ? `${formData.expiryYear}년 ${formData.expiryMonth}월` 
              : ''),
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        referrer: document.referrer || '',
      };

      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3g7Sh6HN0hHTYaQMgsGc8N1PdgRvPriEuVcrD_hukI3-oRpjPWwUKoQncXGcWmoWu/exec';
      
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      console.log("제출 데이터:", submissionData);
      alert("✅ 상담 신청이 완료되었습니다!\n전문 상담원이 곧 연락드리겠습니다.");
      
      setFormData({ 
        name: '', 
        phone: '', 
        expiryYear: '', 
        expiryMonth: '', 
        agreement: false 
      });
      setShowModal(false);

    } catch (error) {
      console.error("제출 오류:", error);
      alert("❌ 일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden bg-gradient-to-b from-sky-50 to-white">
      
      {/* 플로팅 상담 신청 버튼 (우측 고정) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 rounded-l-2xl shadow-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex flex-col items-center gap-1 group"
        >
          <span className="text-xs font-medium opacity-80">상담신청</span>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="text-sm font-bold block">비밀지원금</span>
            <span className="text-sm font-bold block">안내받기</span>
          </div>
        </button>
        
        <a
          href="#"
          className="bg-[#FEE500] text-[#3c1e1e] px-4 py-3 rounded-l-2xl shadow-2xl hover:bg-[#fdd835] transition-all duration-300 flex flex-col items-center gap-1"
        >
          <span className="text-xs font-medium">가입신청</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C6.48 2 2 5.91 2 10.73C2 13.66 3.86 16.25 6.69 17.78C6.34 18.86 5.64 21.28 5.62 21.34C5.59 21.46 5.61 21.58 5.68 21.67C5.75 21.76 5.85 21.81 5.96 21.81C6.03 21.81 6.09 21.8 6.15 21.77C7.4 21.18 10.03 19.73 11.47 18.88C11.65 18.89 11.82 18.9 12 18.9C17.52 18.9 22 14.99 22 10.17C22 5.35 17.52 1.44 12 1.44V2Z" />
          </svg>
          <span className="text-[10px] font-bold">카톡 상담</span>
        </a>
        
        <div className="bg-red-500 text-white px-4 py-3 rounded-l-2xl shadow-2xl">
          <span className="text-[10px] font-medium block text-center">무료상담 대표번호</span>
          <span className="text-base font-black block text-center">1800-0000</span>
        </div>
      </div>

      {/* 상담 신청 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-md relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">📞</span>
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">비밀지원금</h2>
              <p className="text-lg font-bold text-blue-600">문자로 받아보기</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">이 름</label>
                <input
                  type="text"
                  name="name"
                  placeholder="성함을 입력해주세요"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-gray-50"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">연락처</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-gray-50"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">약정 만기 예정일 <span className="font-normal text-gray-400">(선택)</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    name="expiryYear"
                    value={formData.expiryYear || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-gray-50 cursor-pointer"
                  >
                    <option value="">년도 선택</option>
                    <option value="2025">2025년</option>
                    <option value="2026">2026년</option>
                    <option value="2027">2027년</option>
                    <option value="2028">2028년</option>
                    <option value="2029">2029년</option>
                    <option value="만기완료">이미 만기됨</option>
                  </select>
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth || ''}
                    onChange={handleChange}
                    disabled={isSubmitting || !formData.expiryYear || formData.expiryYear === '만기완료'}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-gray-50 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">월 선택</option>
                    <option value="1">1월</option>
                    <option value="2">2월</option>
                    <option value="3">3월</option>
                    <option value="4">4월</option>
                    <option value="5">5월</option>
                    <option value="6">6월</option>
                    <option value="7">7월</option>
                    <option value="8">8월</option>
                    <option value="9">9월</option>
                    <option value="10">10월</option>
                    <option value="11">11월</option>
                    <option value="12">12월</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-1">보유,이용기간 : 개통완료시 D+1095일, 단순상담시 D+14일 후 식별불가 완료와 복제본유,이용기간 : 개통완료시 D+1095일 개인정보 수집에 동의하지 않으시는 경우 상담이 제한됩니다.</p>
              </div>

              <div className="flex items-center">
                <input
                  id="modal-agreement"
                  name="agreement"
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  checked={formData.agreement}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="modal-agreement" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? '전송 중...' : '비밀지원금 문자로 받아보기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white py-3 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="이루다 컴퍼니" className="h-10 lg:h-14 w-auto" />
            <div className="hidden lg:flex items-center gap-1">
              <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">🏆</span>
              <span className="text-sm font-bold text-gray-700">소비자만족도지수 1위</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">KT인터넷</a>
            <a href="#" className="hover:text-blue-600 transition">SK 인터넷</a>
            <a href="#" className="hover:text-blue-600 transition">LG인터넷</a>
            <a href="#" className="hover:text-blue-600 transition">LG헬로비전</a>
            <a href="#" className="text-red-500 font-bold hover:text-red-600 transition">신청서작성</a>
          </nav>

          <a href="tel:1800-0000" className="flex items-center gap-2 text-blue-600">
            <span className="text-2xl">📞</span>
            <span className="text-xl lg:text-2xl font-black">1800-0000</span>
          </a>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 py-12 lg:py-20">
          {/* 배경 장식 - 버블들 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/15 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-20 right-1/3 w-16 h-16 bg-white/20 rounded-full blur-lg animate-float-delayed"></div>
            {/* 더 많은 버블 */}
            <div className="absolute top-1/2 left-10 w-8 h-8 bg-white/30 rounded-full animate-bubble"></div>
            <div className="absolute top-1/3 right-40 w-6 h-6 bg-white/25 rounded-full animate-bubble-delayed"></div>
            <div className="absolute bottom-40 right-10 w-10 h-10 bg-white/20 rounded-full animate-bubble"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              
              {/* 좌측 텍스트 */}
              <div className="text-white text-center lg:text-left mb-8 lg:mb-0 lg:max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-yellow-300 text-lg">🏆</span>
                  <span className="font-bold text-sm">소비자만족도지수 1위</span>
                </div>

                <p className="text-lg lg:text-xl font-medium mb-4 opacity-90">| 인터넷가입 · 변경 |</p>
                
                {/* 메인 숫자 - 3D 스타일 */}
                <div className="relative mb-6">
                  <div className="text-7xl lg:text-[120px] font-black leading-none tracking-tight">
                    <span className="bg-gradient-to-b from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl"
                          style={{ textShadow: '4px 4px 0 rgba(0,100,200,0.3), 8px 8px 0 rgba(0,50,150,0.2)' }}>
                      70
                    </span>
                    <span className="text-4xl lg:text-6xl align-top ml-2">만원</span>
                  </div>
                  <div className="absolute -right-4 lg:-right-10 top-0 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xl lg:text-3xl font-black px-4 py-2 rounded-xl rotate-12 shadow-lg">
                    혜택!
                  </div>
                </div>

                <h2 className="text-2xl lg:text-4xl font-extrabold mb-4 drop-shadow-lg">
                  최저 요금, 최대 지원!
                </h2>
                
                <p className="text-xl lg:text-2xl font-bold opacity-95">
                  ✨ 빠른 설치, 빠른 입금 보장! ✨
                </p>
              </div>

              {/* 우측 이미지 영역 - 제품 이미지 또는 상담원 이미지 */}
              <div className="relative">
                {/* 여기에 PNG/GIF 이미지를 넣을 공간 */}
                <div className="relative w-80 lg:w-[450px] h-80 lg:h-[400px] flex items-center justify-center">
                  {/* 기존 모델 이미지 사용 */}
                  <img
                    src={modelImg}
                    alt="친절한 상담원"
                    className="h-full object-contain drop-shadow-2xl animate-float"
                  />
                  
                  {/* 장식 요소들 */}
                  <div className="absolute -left-10 top-10 bg-white rounded-2xl shadow-xl p-3 animate-bounce-slow">
                    <span className="text-4xl">📺</span>
                  </div>
                  <div className="absolute -right-5 top-20 bg-white rounded-2xl shadow-xl p-3 animate-bounce-slow-delayed">
                    <span className="text-4xl">📱</span>
                  </div>
                  <div className="absolute -left-5 bottom-20 bg-white rounded-2xl shadow-xl p-3 animate-bounce-slow">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <div className="absolute right-0 bottom-10 bg-yellow-400 rounded-2xl shadow-xl p-3 animate-bounce-slow-delayed">
                    <span className="text-4xl">💰</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 비밀지원금 폼 + 실시간 접수 현황 */}
        <section className="py-10 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* 좌측: 간편 문의 폼 */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                    {/* 상담원 아이콘 자리 - 여기에 3D 캐릭터 이미지를 넣을 수 있음 */}
                    <span className="text-5xl">👩‍💼</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">비밀지원금</h3>
                    <p className="text-lg font-bold opacity-90">문자로 받아보기</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 opacity-90">이 름</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="성함을 입력해주세요"
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white/50 transition"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5 opacity-90">연락처</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white/50 transition"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5 opacity-90">약정 만기 예정일 <span className="font-normal opacity-70">(선택)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="expiryYear"
                        value={formData.expiryYear || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-white/50 transition cursor-pointer"
                      >
                        <option value="">년도 선택</option>
                        <option value="2025">2025년</option>
                        <option value="2026">2026년</option>
                        <option value="2027">2027년</option>
                        <option value="2028">2028년</option>
                        <option value="2029">2029년</option>
                        <option value="만기완료">이미 만기됨</option>
                      </select>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth || ''}
                        onChange={handleChange}
                        disabled={!formData.expiryYear || formData.expiryYear === '만기완료'}
                        className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-white/50 transition cursor-pointer disabled:bg-white/50 disabled:cursor-not-allowed"
                      >
                        <option value="">월 선택</option>
                        <option value="1">1월</option>
                        <option value="2">2월</option>
                        <option value="3">3월</option>
                        <option value="4">4월</option>
                        <option value="5">5월</option>
                        <option value="6">6월</option>
                        <option value="7">7월</option>
                        <option value="8">8월</option>
                        <option value="9">9월</option>
                        <option value="10">10월</option>
                        <option value="11">11월</option>
                        <option value="12">12월</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-3 text-xs leading-relaxed">
                    <p>보유,이용기간 : 개통완료시 D+1095일, 단순상담시 D+14일 후 식별불가 완료와 복제본유,이용기간 : 개통완료시 D+1095일 개인정보 수집에 동의하지 않으시는 경우 상담이 제한됩니다.</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="inline-agreement"
                      name="agreement"
                      type="checkbox"
                      className="w-5 h-5 rounded cursor-pointer"
                      checked={formData.agreement}
                      onChange={handleChange}
                    />
                    <label htmlFor="inline-agreement" className="ml-2 text-sm cursor-pointer">
                      개인정보 수집 및 이용에 동의합니다.
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition shadow-lg"
                  >
                    {isSubmitting ? '전송 중...' : '비밀지원금 문자로 받아보기'}
                  </button>
                </div>
              </div>

              {/* 우측: 실시간 상담 접수 현황 */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex">
                  <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-4 font-bold">
                    지원금 리스트
                  </div>
                  <div className="flex-1 bg-gray-100 text-gray-600 text-center py-4 font-bold">
                    자유게시판
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-4 text-sm font-bold text-gray-500 border-b pb-3 mb-3">
                    <span>상태</span>
                    <span>고객명</span>
                    <span>구분</span>
                    <span>접수일</span>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentConsults.map((consult, index) => (
                      <div key={index} className="grid grid-cols-4 text-sm items-center py-2 border-b border-gray-50 hover:bg-gray-50 transition">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${
                          consult.status === '상담완료' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {consult.status}
                        </span>
                        <span className="text-gray-700">{consult.name}</span>
                        <span className="text-gray-500">{consult.type}</span>
                        <span className="text-gray-400">{consult.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 이루다컴퍼니의 차별점 */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-500 text-white text-sm font-bold px-6 py-2 rounded-full mb-4">
                이루다컴퍼니의 차별점
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-blue-600">
                이루다컴퍼니는 다릅니다!
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              {/* 카드 1 */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  {/* 여기에 3D 캐릭터/아이콘 이미지 */}
                  <span className="text-6xl">🙅‍♂️</span>
                </div>
                <h3 className="text-xl font-black text-blue-600 mb-2">불필요하고 과도한</h3>
                <h3 className="text-xl font-black text-blue-600 mb-4">요금설계는 <span className="text-red-500">절대 NO</span></h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  고요금제 또는 불필요한 상품 끼워팔기 없이.<br/>
                  고객님께서 필요로 하시는<br/>
                  <span className="font-bold text-gray-800">적합한 상품을 맞춤 설계</span>해드립니다.
                </p>
              </div>

              {/* 카드 2 */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-6xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-black text-blue-600 mb-4">본사 출신<br/>전문상담사</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  본사 출신 전문 상담사가<br/>
                  기존 인터넷TV, 휴대폰 요금까지 고려하여<br/>
                  고객님께 <span className="font-bold text-gray-800">가장 유리한 상품을 추천</span>해드립니다.
                </p>
              </div>

              {/* 카드 3 */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <span className="text-6xl">💵</span>
                </div>
                <h3 className="text-xl font-black text-blue-600 mb-4">현금 사은품 최대로<br/>지원 도와드립니다</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  광고비용, 유통 수수료를 최소화하여<br/>
                  타영업점과 다르게 고객님께<br/>
                  <span className="font-bold text-gray-800">최대 지원금 혜택을 약속</span>드립니다.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 가입 절차 섹션 */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <h3 className="text-2xl font-black text-gray-800 mb-2">이루다컴퍼니</h3>
                <h2 className="text-4xl lg:text-5xl font-black text-blue-600 mb-4">가입절차</h2>
                <p className="text-gray-600">상담부터 설치, 현금 입금까지!</p>
              </div>

              {/* 스텝 진행 */}
              <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-0">
                
                {/* Step 1 */}
                <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    currentStep === 0 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white border-4 border-blue-200'
                  }`}>
                    <span className={`text-4xl lg:text-5xl ${currentStep === 0 ? 'animate-bounce' : ''}`}>💬</span>
                  </div>
                  <span className="font-bold text-blue-600">가입상담</span>
                  <span className="text-xs text-gray-500">전문 상담사 무료상담</span>
                </div>

                <div className="hidden lg:flex items-center">
                  <div className={`w-16 h-1 transition-all duration-500 ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    →
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    currentStep === 1 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white border-4 border-blue-200'
                  }`}>
                    <span className={`text-4xl lg:text-5xl ${currentStep === 1 ? 'animate-bounce' : ''}`}>📋</span>
                  </div>
                  <span className="font-bold text-blue-600">본사긴급접수</span>
                  <span className="text-xs text-gray-500">신청 후 3시간 이내</span>
                </div>

                <div className="hidden lg:flex items-center">
                  <div className={`w-16 h-1 transition-all duration-500 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    →
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    currentStep === 2 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white border-4 border-blue-200'
                  }`}>
                    <span className={`text-4xl lg:text-5xl ${currentStep === 2 ? 'animate-bounce' : ''}`}>📅</span>
                  </div>
                  <span className="font-bold text-blue-600">설치일정조율</span>
                  <span className="text-xs text-gray-500">신청 후 5시간 이내</span>
                </div>

                <div className="hidden lg:flex items-center">
                  <div className={`w-16 h-1 transition-all duration-500 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    →
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    currentStep === 3 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white border-4 border-blue-200'
                  }`}>
                    <span className={`text-4xl lg:text-5xl ${currentStep === 3 ? 'animate-bounce' : ''}`}>💡</span>
                  </div>
                  <span className="font-bold text-blue-600">설치 완료</span>
                  <span className="text-xs text-gray-500">신청 후 1~2일 이내</span>
                </div>

                <div className="hidden lg:flex items-center">
                  <div className={`w-16 h-1 transition-all duration-500 ${currentStep >= 4 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    →
                  </div>
                </div>

                {/* Step 5 */}
                <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 4 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                  <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                    currentStep === 4 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white border-4 border-blue-200'
                  }`}>
                    <span className={`text-4xl lg:text-5xl ${currentStep === 4 ? 'animate-bounce' : ''}`}>💰</span>
                  </div>
                  <span className="font-bold text-blue-600">현금 입금</span>
                  <span className="text-xs text-gray-500">설치완료 후 1~2일 이내</span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 핵심 혜택 (기존 유지 + 스타일 개선) */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-800">
                📣 <span className="text-blue-600">이루다컴퍼니</span>만의 특별 혜택
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-green-200">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">현금 사은품 최대</h3>
                <p className="text-gray-600 text-sm">정책 한도 내 최대 금액<br/>설치 다음 주 즉시 입금</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-blue-200">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">결합 할인 혜택</h3>
                <p className="text-gray-600 text-sm">휴대폰 결합 시<br/>매월 요금 추가 할인</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-orange-200">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">초고속 설치</h3>
                <p className="text-gray-600 text-sm">원하는 시간에<br/>빠르고 정확한 설치</p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              지금 바로 상담받고 <span className="text-yellow-300">최대 70만원</span> 혜택 받으세요!
            </h2>
            <p className="text-lg opacity-90 mb-8">
              365일 전문 상담원이 최적의 요금제를 안내해 드립니다
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 text-xl font-black px-12 py-5 rounded-full hover:bg-blue-50 transition shadow-2xl hover:scale-105 transform"
            >
              🚀 무료 상담 신청하기
            </button>
          </div>
        </section>

      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-10 lg:py-14">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 font-bold text-gray-300 text-lg">
            통신3사(SKT/KT/LG) 공식 가입대리점
          </p>
          <p className="text-sm leading-relaxed mb-1">
            상호명: (주)이루다컴퍼니 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890
          </p>
          <p className="text-sm leading-relaxed">
            주소: 대전광역시 서구 월평로 27
          </p>
          <p className="mt-6 opacity-60 text-sm">
            Copyright © 2024. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 추가 CSS 애니메이션을 위한 스타일 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
        @keyframes bubble-delayed {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-bubble { animation: bubble 3s ease-in-out infinite; }
        .animate-bubble-delayed { animation: bubble-delayed 4s ease-in-out infinite 1s; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-bounce-slow-delayed { animation: bounce-slow-delayed 3.5s ease-in-out infinite 0.5s; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default App;