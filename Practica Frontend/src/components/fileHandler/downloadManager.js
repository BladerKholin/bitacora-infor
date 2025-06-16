import { Button } from "@chakra-ui/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // Change this to match your backend

const DownloadButton = ({ fileId, fileName }) => {
    console.log(fileId)
    const handleDownload = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/attachments/download/${fileId}`,{ method: 'get', credentials: 'include' });
            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName; // ✅ Properly sets the file name
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log()
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return <Button onClick={handleDownload}>Descargar</Button>;
};

export default DownloadButton;
