import React from 'react';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Change this to match your backend

export default function XlsxButton() {
  // JSX button:
  return (
    <div>
      <Button onClick={() => window.open(`${API_BASE_URL}/exports/xlsx`, '_blank')}>
        Exportar datos a excel
      </Button>
    </div>
  );
}

