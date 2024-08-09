import React from 'react';

const PrivacyPopup = ({ onClose, handleCheck, checked }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
      <h2 className="text-lg font-semibold">개인정보 수집 및 이용</h2>
      <div
        className="mt-5 mb-5 max-h-[60vh] overflow-y-auto"
        style={{
          boxSizing: 'border-box',
          maxHeight: '300px',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #d6d6d6',
        }}
      >
        <p>여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다. 여기에 개인정보 수집 및 이용 내용 작성합니다.</p>
      </div>
      <div className="flex items-center mt-4 mb-4">
        <input
          type="checkbox"
          checked={checked.privacy} // privacy 상태를 전달받아 체크박스 상태를 관리
          onChange={() => handleCheck('privacy')}
          className="mr-2"
        />
        <label>개인정보 수집 및 이용에 동의합니다.</label>
        <button
          onClick={onClose}
          className="ml-auto mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
);

export default PrivacyPopup;
