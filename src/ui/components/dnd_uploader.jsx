import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DnDUploader({ onDrop }) {
    const [highlight, setHighlight] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");


    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setHighlight(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setHighlight(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setHighlight(false);
        const file = e.dataTransfer.files[0];
        setFile(file);
        setFileName(file.name);
        onDrop(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file.name);
        onDrop(file);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName("");
    };

    return (
        <div
            className={`dnd-uploader ${highlight ? "highlight" : ""} ${error ? "error" : ""
                }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {file ? (
                <div className="file">
                    <div className="file-name">{fileName}</div>
                    <div className="file-remove" onClick={handleRemoveFile}>
                        <FontAwesomeIcon icon="times" />
                    </div>
                </div>
            ) : (
                <div className="file">
                    <div className="file-name">Drag and drop a file here</div>
                    <div className="file-name">or</div>
                    <div className="file-name">
                        <label htmlFor="file-upload" className="file-upload">
                            Browse
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            )}
            {error && <div className="error-message">{errorMessage}</div>}
        </div>
    );
}

export default DnDUploader;