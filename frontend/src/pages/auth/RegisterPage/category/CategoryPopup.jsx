import React, { useState } from 'react';
import Draggable from 'react-draggable'; // 팝업을 드래그할 수 있도록 해주는 라이브러리

// 팝업 내에서 선택된 카테고리 상태 관리
const CategoryPopup = ({ categories, onSelect, onClose, selectedCategories }) => {
    // CategoryPopup 컴포넌트는 여러 프롭스를 받습니다.
    // categories: 카테고리 데이터.
    // onSelect: 선택된 카테고리를 부모 컴포넌트로 전달하는 함수.
    // onClose: 팝업을 닫는 함수.
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories);
    // selectedCategories: 이미 선택된 카테고리.
    // localSelectedCategories 상태를 사용하여 팝업 내에서 선택된 카테고리를 관리합니다.

   // 카테고리 선택/해제 핸들러
  const handleSelect = (main, sub) => {
    const isSelected = localSelectedCategories.some(cat => cat.main === main && cat.sub === sub);
    //스키마에서 main과 sub는 카테고리 객체의 속성으로 정의되어 있습니다. 즉, 스키마가 정의한 데이터 구조에 맞추어야 합니다.
    
    // localSelectedCategories
    // 이 변수는 현재 팝업에서 사용자가 선택한 카테고리들의 목록을 담고 있는 배열입니다.
    // 배열의 각 항목은 카테고리 객체로, { main, sub } 형태로 되어 있습니다.

    // some 메서드:
    // Array.prototype.some() 메서드는 배열의 각 요소에 대해 주어진 조건을 테스트하고, 조건을 만족하는 요소가 하나라도 있으면 true를 반환합니다.
    // 조건을 만족하는 요소가 없다면 false를 반환합니다.
    // 이 메서드는 배열에서 특정 조건을 만족하는 요소가 존재하는지 여부를 확인할 때 유용합니다.

    if (isSelected) {
      // 이미 선택된 카테고리면, 선택 해제합니다.
      setLocalSelectedCategories(prev => prev.filter(cat => !(cat.main === main && cat.sub === sub)));
      // prev: 이전의 선택된 카테고리 배열입니다.
      // cat = 요소
      // filter 메서드: 배열에서 주어진 조건을 만족하는 요소를 제외한 새로운 배열을 반환합니다.
      // 조건 (!(cat.main === main && cat.sub === sub)): 현재 선택된 카테고리 배열에서 main과 sub이 일치하는 카테고리를 제거합니다.
      // 같지 않으면 트루로 남고 폴스면 제거됨
    } else {
      // 선택되지 않은 카테고리면, 새로 추가합니다.
      const category = { main, sub };
      setLocalSelectedCategories(prev => [...prev, category]);
      //  ...prev: 기존의 선택된 카테고리들을 펼쳐서 새로운 배열을 만듭니다.
      // [...prev, category]: 새로운 카테고리 객체를 배열의 끝에 추가합니다.
    }
  };

   // 확인 버튼 클릭 핸들러
  const handleSubmit = () => {
    onSelect(localSelectedCategories);
    // 현재 선택된 카테고리를 부모 컴포넌트로 전달하고, 그냥 팝업을 닫습니다.
    onClose();
   
  };

   // 팝업 닫기 핸들러
  const handleClose = (e) => {
    e.stopPropagation();
    //클릭 이벤트가 팝업 내부로 전파되지 않도록 합니다.
    onClose();
  };

  return (
     // 팝업 전체를 감싸는 div는 화면 전체를 덮고, 배경을 어둡게 하여 팝업이 더 잘 보이게 합니다.
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
        <h2 className="text-xl font-semibold mb-4">카테고리 선택</h2>
        {/* 카테고리 리스트 */}
        {Object.entries(categories).map(([main, subs]) => (
          <div key={main} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{main}</h3>
            <div className="flex flex-wrap gap-2">
              {subs.map(sub => (
                <button
                  key={sub}
                  type="button"
                  className={`px-4 py-2 text-sm ${localSelectedCategories.some(cat => cat.main === main && cat.sub === sub) ? 'bg-blue-100' : 'text-blue-600'} hover:bg-blue-100`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(main, sub);
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))}
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

export default CategoryPopup;
