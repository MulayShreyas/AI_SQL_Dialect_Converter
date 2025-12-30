import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiFolder } from 'react-icons/fi';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setUploadedFile(file);
                onFileUpload(file);
            }
        },
        [onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.sql', '.txt'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        multiple: false,
    });

    return (
        <div className="file-upload-card">
            <div className="card-header">
                <div className="card-icon folder-icon">
                    <FiFolder />
                </div>
                <div className="card-title-section">
                    <h3 className="card-title">Upload SQL File</h3>
                    <p className="card-subtitle">Drag and drop or click to up upload</p>
                </div>
            </div>

            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            >
                <input {...getInputProps()} />

                <div className="dropzone-content">
                    {isDragActive ? (
                        <>
                            <FiUploadCloud className="upload-icon active" />
                            <p className="dropzone-text">Drop the file here...</p>
                        </>
                    ) : uploadedFile ? (
                        <div className="file-info">
                            <FiFile className="file-icon" />
                            <p className="file-name">{uploadedFile.name}</p>
                            <p className="file-size">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    ) : (
                        <>
                            <FiUploadCloud className="upload-icon" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileUpload;
