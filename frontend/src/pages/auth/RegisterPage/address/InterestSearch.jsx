import React, { useState, useEffect } from 'react';

const InterestSearch = ({ setInterestSido, setInterestSigoon, setInterestDong }) => {
  const [interestSearchTerm, setInterestSearchTerm] = useState('');
  const [interestResults, setInterestResults] = useState([]);

  const handleInterestSearch = (e) => {
    setInterestSearchTerm(e.target.value);
  };

  const apiKey = process.env.REACT_APP_API_KEY;
  const port = process.env.REACT_APP_ADDRESS_API;

  useEffect(() => {
    if (interestSearchTerm) {
      fetch(`api/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=286E5CAE-A8D1-3D02-AB4E-2DF927614303&domain=${port}&attrFilter=emd_kor_nm:like:${interestSearchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.response && data.response.status === 'OK' && data.response.result && data.response.result.featureCollection.features) {
            setInterestResults(data.response.result.featureCollection.features.map(item => item.properties));
          } else {
            setInterestResults([]);
            console.error('Invalid API response:', data);
          }
        })
        .catch(error => {
          setInterestResults([]);
          console.error('Error fetching data:', error);
        });
    } else {
      setInterestResults([]);
    }
  }, [interestSearchTerm]);

  const handleInterestSelect = (item) => {
    const [i_sido, i_sigoon, i_dong] = item.full_nm.split(' ');
    setInterestSido(i_sido);
    setInterestSigoon(i_sigoon);
    setInterestDong(i_dong);
    setInterestResults([]);
    setInterestSearchTerm(item.full_nm);
    console.log(i_sido);
    console.log(i_sigoon);
    console.log(i_dong);
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (interestResults.length > 0) {
        handleInterestSelect(interestResults[0]);
      }
    }
  };

  return (
    <div className="text-sm text-gray-800">
      <input className='w-full px-4 py-2 mt-2 bg-white border rounded-md' type="text" value={interestSearchTerm} onChange={handleInterestSearch} onKeyDown={handleInterestKeyDown} />
      <ul>
        {interestResults.map((item, index) => (
          <li 
          className="p-2 hover:bg-gray-200 cursor-pointer"
          key={index} 
          onClick={() => handleInterestSelect(item)}>{item.full_nm}</li>
        ))}
      </ul>
    </div>
  );
};

export default InterestSearch;
