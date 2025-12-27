import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);
            }
        },
        [onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
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
        <div className="file-upload-container">
            <h3 className="section-title">📂 Upload SQL File</h3>
            <p className="section-subtitle">Drag and drop or click to upload</p>

            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            >
                <input {...getInputProps()} />

                <div className="dropzone-content">
                    <FiUpload className="upload-icon" />

                    {isDragActive ? (
                        <p className="dropzone-text">Drop the file here...</p>
                    ) : acceptedFiles.length > 0 ? (
                        <div className="file-info">
                            <FiFile className="file-icon" />
                            <p className="file-name">{acceptedFiles[0].name}</p>
                            <p className="file-size">
                                {(acceptedFiles[0].size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="dropzone-text">
                                Drag & drop your SQL file here, or click to browse
                            </p>
                            <p className="dropzone-hint">
                                Supported formats: PDF, SQL, TXT, Excel (XLSX/XLS)
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileUpload;
