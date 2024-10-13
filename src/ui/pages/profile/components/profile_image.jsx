import { AddCircleRounded, AddOutlined } from "@mui/icons-material";
import classNames from "classnames";
import { useRef, useState } from "react";

function ProfileImage({ image, onChange }) {
    const fileInputRef = useRef();
    const [highlight, setHighlight] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState(null);
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
        onChange(file);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        onChange(file);
    };
    const handleRemoveFile = () => {
        setFile(null);
    };
    const imageUrl = file ? URL.createObjectURL(file) : image;
    return (
        <>
            <div
                className={classNames(
                    "flex items-center justify-center cursor-pointer rounded-full bg-white",
                    {
                        "border-green-500": highlight,
                        "border-red-500": error,
                        "border-dashed border-2 border-gray-300": !imageUrl,
                    },
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => {
                    fileInputRef.current.click();
                }}
                style={{ width: "130px", height: "130px" }}
            >
                <div className="relative">
                    {imageUrl ? (
                        <>
                            <img
                                src={imageUrl}
                                alt="avatar"
                                className="rounded-full w-full h-full bg-white"
                                style={{ width: "130px", height: "130px" }}
                            />
                            <div
                                className="w-[30px] h-[30px] left-[93px] top-[93px] absolute bg-blue-500 rounded-[15px] flex items-center justify-center cursor-pointer"
                            >
                                <AddOutlined className="text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[130px] content-center ">
                            <AddOutlined
                                className="text-gray-500"
                                size={32}
                            />
                            <p className="text-gray-500">Загрузить</p>
                        </div>
                    )}
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    )
}
export default ProfileImage;