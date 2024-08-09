import React, { useState } from 'react';
import Draggable from 'react-draggable';

const JobPopup = ({ jobCategories, onSelect, onClose, selectedJobs }) => {
  // 현재 선택된 직무 상태 관리
  const [localSelectedJobs, setLocalSelectedJobs] = useState(selectedJobs);
  const [error, setError] = useState('');
  // 직무 선택/해제 핸들러
  const handleSelect = (job) => {
    // 직무가 이미 선택된 상태인지 확인
    const isSelected = localSelectedJobs.includes(job);

    if (isSelected) {
      // 직무가 선택된 상태라면 제거
      setLocalSelectedJobs(prev => prev.filter(selectedJob => selectedJob !== job));
    } else {
      // 직무가 선택되지 않은 상태라면 추가
      if (localSelectedJobs.length < 3) { // 최대 3개 선택 가능
        setLocalSelectedJobs(prev => [...prev, job]);
        setError('');
      } else {
        setError('최대 3개의 직무만 선택할 수 있습니다.');
      }
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleSubmit = () => {
    onSelect(localSelectedJobs); // 선택된 직무를 부모 컴포넌트에 전달
    onClose(); // 팝업 닫기
  };

  // 팝업 닫기 핸들러
  const handleClose = (e) => {
    e.stopPropagation();
    onClose(); // 팝업 닫기
  };

  return (
    <div className="popup fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      <Draggable>
        <div 
          className="bg-white p-6 rounded-md shadow-lg max-w-4xl max-h-[80vh] overflow-auto relative" 
          onClick={(e) => e.stopPropagation()} 
          style={{ width: '600px' }}
        >
          {/* X 버튼 */}
          <button 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={handleClose}
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">직무 선택</h2>

          {/* 에러 메시지 */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* 직무 리스트 */}
          <div className="flex flex-wrap gap-2">
            {jobCategories.map(job => (
              <button
                key={job}
                type="button"
                className={`px-4 py-2 text-sm ${localSelectedJobs.includes(job) ? 'bg-blue-100 text-blue-700' : 'text-blue-600'} hover:bg-blue-100`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(job); // 직무 문자열을 직접 전달
                }}
              >
                {job}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleSubmit}
            >
              확인
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={handleClose}
            >
              닫기
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default JobPopup;
