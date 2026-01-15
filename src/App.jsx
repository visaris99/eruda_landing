import { useState } from 'react';
import logoImg from './assets/logo.png';
import modelImg from './assets/model_fix.png';
import bgImg from './assets/bg.png';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    expiryDate: '',
    agreement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // 유효성 검사
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
      // UTM 파라미터 수집
      const urlParams = new URLSearchParams(window.location.search);
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        phone: formData.phone,
        expiryDate: formData.expiryDate || '',
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        referrer: document.referrer || '',
      };

      // ⚠️ 여기에 Google Apps Script 웹 앱 URL을 입력하세요
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3g7Sh6HN0hHTYaQMgsGc8N1PdgRvPriEuVcrD_hukI3-oRpjPWwUKoQncXGcWmoWu/exec';
      
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      console.log("제출 데이터:", submissionData);
      alert("✅ 상담 신청이 완료되었습니다!\n전문 상담원이 곧 연락드리겠습니다.");
      
      // 폼 초기화
      setFormData({ 
        name: '', 
        phone: '', 
        expiryDate: '', 
        agreement: false 
      });

    } catch (error) {
      console.error("제출 오류:", error);
      alert("❌ 일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white py-3 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <img src={logoImg} alt="이루다 컴퍼니" className="h-10 lg:h-14 w-auto" />
          
          <a href="#" className="bg-[#FEE500] text-[#3c1e1e] px-4 py-2 lg:px-6 lg:py-3 rounded-full font-bold hover:bg-[#fdd835] transition shadow-md flex items-center text-sm lg:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 mr-1.5">
              <path d="M12 2C6.48 2 2 5.91 2 10.73C2 13.66 3.86 16.25 6.69 17.78C6.34 18.86 5.64 21.28 5.62 21.34C5.59 21.46 5.61 21.58 5.68 21.67C5.75 21.76 5.85 21.81 5.96 21.81C6.03 21.81 6.09 21.8 6.15 21.77C7.4 21.18 10.03 19.73 11.47 18.88C11.65 18.89 11.82 18.9 12 18.9C17.52 18.9 22 14.99 22 10.17C22 5.35 17.52 1.44 12 1.44V2Z" />
            </svg>
            <span className="hidden sm:inline">카카오톡 상담</span>
            <span className="sm:hidden">상담</span>
          </a>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section 
          className="text-white relative overflow-hidden"
          style={{ 
            backgroundImage: `url(${bgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#4a9d5f',
          }}
        >
          <div className="container mx-auto px-4 py-10 lg:py-16">
            <div className="mb-4 lg:mb-6">
              <span className="inline-block bg-white text-brand-dark font-bold text-xs lg:text-sm px-3 py-1.5 rounded-full shadow-lg">
                📢 365일 공식 가입센터
              </span>
            </div>
            
            <h1 className="text-2xl lg:text-5xl font-extrabold leading-tight mb-6 lg:mb-8 drop-shadow-lg">
              <span className="text-yellow-300">최대 70만원</span> 지급!<br />
              통신사 요금 비교<br />
              전문 <span className="text-yellow-300">상담</span>을 통해<br />
              도와드리겠습니다
            </h1>

            <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-auto">
              <img
                src={modelImg}
                alt="친절한 상담원"
                className="h-[450px] xl:h-[500px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* 핵심 혜택 */}
        <section className="py-8 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-10 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              
              <div className="text-center">
                <div className="text-5xl lg:text-6xl mb-3 bg-green-50 w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full flex items-center justify-center">
                  💰
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">현금 사은품 최대</h3>
                <p className="text-sm lg:text-base text-gray-600">정책 한도 내 최대 금액<br/>설치 다음 주 즉시 입금</p>
              </div>

              <div className="text-center">
                <div className="text-5xl lg:text-6xl mb-3 bg-green-50 w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full flex items-center justify-center">
                  📱
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">결합 할인 혜택</h3>
                <p className="text-sm lg:text-base text-gray-600">휴대폰 결합 시<br/>매월 요금 추가 할인</p>
              </div>

              <div className="text-center">
                <div className="text-5xl lg:text-6xl mb-3 bg-green-50 w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">초고속 설치</h3>
                <p className="text-sm lg:text-base text-gray-600">원하는 시간에<br/>빠르고 정확한 설치</p>
              </div>

            </div>
          </div>
        </section>

        {/* 상담 신청 폼 */}
        <section className="py-10 lg:py-20 bg-gradient-to-b from-gray-50 to-white" id="consult-form">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-10 border-t-8 border-brand-main">
              
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-800">
                  🚀 3초 간편 상담 신청
                </h2>
                <p className="text-sm lg:text-base text-gray-600">
                  전문 상담원이 최적의 요금제를 안내해 드립니다
                </p>
              </div>

              <div className="space-y-5 lg:space-y-6">
                
                <div>
                  <label htmlFor="name" className="block text-base lg:text-lg font-bold text-gray-700 mb-2">
                    성함
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="성함을 입력해주세요"
                    className="w-full px-4 py-3.5 lg:py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-brand-main/30 focus:border-brand-main transition bg-gray-50 text-base"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-base lg:text-lg font-bold text-gray-700 mb-2">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3.5 lg:py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-brand-main/30 focus:border-brand-main transition bg-gray-50 text-base"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="expiryDate" className="block text-base lg:text-lg font-bold text-gray-700 mb-2">
                    약정 만기 월 <span className="text-sm font-normal text-gray-500">(선택)</span>
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="예: 2024년 10월"
                    className="w-full px-4 py-3.5 lg:py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-brand-main/30 focus:border-brand-main transition bg-gray-50 text-base"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-start pt-2">
                  <input
                    id="agreement"
                    name="agreement"
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 text-brand-main border-gray-300 rounded focus:ring-brand-main cursor-pointer"
                    checked={formData.agreement}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="agreement" className="ml-3 text-sm lg:text-base text-gray-700 cursor-pointer">
                    [필수] 개인정보 수집 및 이용 동의
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-brand-main to-brand-dark text-white text-lg lg:text-xl font-bold py-4 lg:py-5 rounded-xl hover:shadow-2xl hover:scale-[1.02] transform transition mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? '전송 중...' : '무료 상담 신청하기'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-8 lg:py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-3 font-bold text-gray-300 text-base lg:text-lg">
            통신3사(SKT/KT/LG) 공식 가입대리점
          </p>
          <p className="text-xs lg:text-sm leading-relaxed mb-1">
            상호명: (주)이루다컴퍼니 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890
          </p>
          <p className="text-xs lg:text-sm leading-relaxed">
            주소: 대전광역시 서구 월평로 27
          </p>
          <p className="mt-6 opacity-60 text-xs lg:text-sm">
            Copyright © 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;