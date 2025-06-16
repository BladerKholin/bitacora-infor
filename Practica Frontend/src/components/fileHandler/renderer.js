import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // Change this to match your backend

const FileRenderer = ({ fileId }) => {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [fileBlob, setFileBlob] = useState(null);
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(`${API_BASE_URL}/attachments/showcase/${fileId}`,{ method: 'get', credentials: 'include' });
            if (response.ok) {
                const blob = await response.blob();
                const contentType = response.headers.get('Content-Type');
                setFileBlob(blob);
                setFileType(contentType);

                if (contentType === 'application/pdf') {
                    setPdfBlob(blob);
                }
            } else {
                console.error('Error fetching file');
                console.log(await response.json())
            }
        };

        fetchFile();
    }, [fileId]);

    const renderFile = () => {
        if (pdfBlob) {
            return <iframe src={URL.createObjectURL(pdfBlob)} width="100%" height="600px" title="PDF Viewer" />;
        }

        switch (fileType) {
            case 'application/pdf':
                return <iframe src={URL.createObjectURL(fileBlob)} width="100%" height="600px" title="PDF Viewer" />;
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return <img src={URL.createObjectURL(fileBlob)} alt="Image Viewer" style={{ width: '100%', height: 'auto' }} />;
            default:
                return <p>Cargando</p>;
        }
    };

    return <div>{renderFile()}</div>;
};

export default FileRenderer;