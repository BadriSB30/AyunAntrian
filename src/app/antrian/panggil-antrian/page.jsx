'use client';

import React, { useEffect, useState } from 'react';
import ScrollInSection from '@/components/Animate/ScroolInSelection';
import PanggilAntrianDesktop from '@/components/PanggilAntrian/PanggilAntrianDesktop';
import PanggilAntrianMobile from '@/components/PanggilAntrian/PanggilAntrianMobile';

const PanggilAntrian = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/antrian/list');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <ScrollInSection>
        {loading ? (
          <p className="p-4">Loading data...</p>
        ) : (
          <>
            <PanggilAntrianDesktop data={data} />
            <PanggilAntrianMobile data={data} />
          </>
        )}
      </ScrollInSection>
    </div>
  );
};

export default PanggilAntrian;
