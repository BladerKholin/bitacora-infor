import React from 'react';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // Change this to match your backend

const downloadPDF = async (eventId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/exports/pdf/${eventId}`,{ method: 'get', credentials: 'include' });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${eventId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
    }
};




const DownloadPDF = ({eventId}) => {
  // JSX button:
  return (
    <div>
      <Button onClick={() => downloadPDF(eventId)}>Exportar a PDF</Button>
    </div>
  );
};

export default DownloadPDF;