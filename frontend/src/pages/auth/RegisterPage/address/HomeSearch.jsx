import React, { useState, useEffect } from 'react';

const HomeSearch = ({ setSelectedSido, setSelectedSigoon, setSelectedDong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const apiKey = process.env.REACT_APP_API_KEY;
  const port = process.env.REACT_APP_ADDRESS_API;
  // 확인을 위한 로그 출력
  console.log('API Key:', process.env.REACT_APP_API_KEY); // undefined 확인

  useEffect(() => {
    if (searchTerm) {
      fetch(`/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=286E5CAE-A8D1-3D02-AB4E-2DF927614303&domain=${port}&attrFilter=emd_kor_nm:like:${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            if (data.response && data.response.status === 'OK' && data.response.result && data.response.result.featureCollection.features) {
              setResults(data.response.result.featureCollection.features.map(item => item.properties));
            } else {
              setResults([]);
              console.error('Invalid API response:', data);
            }
          })
          .catch(error => {
            setResults([]);
            console.error('Error fetching data:', error);
          });
      } else {
        setResults([]);
      }
  }, [searchTerm]);

  const handleSelect = (item) => {
    const [sido, sigoon, dong] = item.full_nm.split(' ');
    setSelectedSido(sido);
    setSelectedSigoon(sigoon);
    setSelectedDong(dong);
    setResults([]);
    setSearchTerm(item.full_nm);
    console.log('Selected Sido:', sido);
    console.log('Selected Sigoon:', sigoon);
    console.log('Selected Dong:', dong);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      }
    }
  };

  return (
    <div className="text-sm text-gray-800">
      <input
        className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <ul>
        {results.map((item, index) => (
          <li
            className="p-2 hover:bg-gray-200 cursor-pointer"
            key={index}
            onClick={() => handleSelect(item)}
          >
            {item.full_nm}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeSearch;
