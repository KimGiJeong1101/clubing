import React, { useState, useEffect } from 'react';

const WorkplaceSearch = ({ setWorkplaceSido, setWorkplaceSigoon, setWorkplaceDong }) => {
  const [workplaceSearchTerm, setWorkplaceSearchTerm] = useState('');
  const [workplaceResults, setWorkplaceResults] = useState([]);

  const handleWorkplaceSearch = (e) => {
    setWorkplaceSearchTerm(e.target.value);
  };

  const port = process.env.REACT_APP_ADDRESS_API;

  useEffect(() => {
    if (workplaceSearchTerm) {
      fetch(`api/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=286E5CAE-A8D1-3D02-AB4E-2DF927614303&domain=${port}&attrFilter=emd_kor_nm:like:${workplaceSearchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.response && data.response.status === 'OK' && data.response.result && data.response.result.featureCollection.features) {
            setWorkplaceResults(data.response.result.featureCollection.features.map(item => item.properties));
          } else {
            setWorkplaceResults([]);
            console.error('Invalid API response:', data);
          }
        })
        .catch(error => {
          setWorkplaceResults([]);
          console.error('Error fetching data:', error);
        });
    } else {
      setWorkplaceResults([]);
    }
  }, [workplaceSearchTerm]);

  const handleWorkplaceSelect = (item) => {
    const [w_sido, w_sigoon, w_dong] = item.full_nm.split(' ');
    setWorkplaceSido(w_sido);
    setWorkplaceSigoon(w_sigoon);
    setWorkplaceDong(w_dong);
    setWorkplaceResults([]);
    setWorkplaceSearchTerm(item.full_nm);
    console.log(w_sido);
    console.log(w_sigoon);
    console.log(w_dong);
  };

  const handleWorkplaceKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (workplaceResults.length > 0) {
        handleWorkplaceSelect(workplaceResults[0]);
      }
    }
  };

  return (
    <div className="text-sm text-gray-800">
      <input className='w-full px-4 py-2 mt-2 bg-white border rounded-md' type="text" value={workplaceSearchTerm} onChange={handleWorkplaceSearch} onKeyDown={handleWorkplaceKeyDown} />
      <ul>
        {workplaceResults.map((item, index) => (
          <li 
          className="p-2 hover:bg-gray-200 cursor-pointer"
          key={index} 
          onClick={() => handleWorkplaceSelect(item)}>{item.full_nm}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkplaceSearch;
