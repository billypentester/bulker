import React, { useState } from 'react';
import Papa from 'papaparse';

import Button from 'react-bootstrap/esm/Button';

function ExportButton({ data }) {

    function convertToCSV(newData) {
        const csv = Papa.unparse(newData);
        return csv;
    }

    const handleExport = () => {
        const newData = data
        const csv = convertToCSV(newData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'coupon.csv';
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleExport} variant='success'>Export as CSV</Button>
    );
    
}

export default ExportButton;
