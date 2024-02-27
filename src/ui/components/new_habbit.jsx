import React from "react";

function ImageGallery(props) {
    return (
        <div className="items-stretch self-stretch flex gap-4 mt-7 max-md:justify-center">
            <div className="justify-center items-center bg-pink-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ad7f3de2ccfc7c9954d2b6477bffc13f1b08aa4011c2e61d9b7ce129a7e288e?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-full overflow-hidden"
                />
            </div>
            <div className="justify-center items-center bg-pink-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/28053efb92de61ae653bc58375384e40ffe9bffd158e8ba2e82fede24f1689f9?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-full overflow-hidden"
                />
            </div>
            <div className="justify-center items-center bg-pink-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a6629d775381651cf29db5b15aca2238267b2a63202287d1c7718227e549194?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-full overflow-hidden"
                />
            </div>
            <div className="justify-center items-center bg-pink-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a90fac7094a6a77f6b2ed39305ba75b44410f87537fa654940ac1c719b9c61fa?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-full overflow-hidden"
                />
            </div>
            <div className="justify-center items-center bg-pink-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/13cd705227f43861f354a9310ece97e711cd4918f576d95a30dc7ff3a214162b?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-full overflow-hidden"
                />
            </div>
            <div className="justify-center items-center bg-pink-50 flex aspect-[0.9583333333333334] flex-col p-3 rounded-lg">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/da7c28146384bdc2ec83e038d2c122032384b15682f497dce690d504c55a1aa7?apiKey=cec8b8de6b6742f0a151f83238334164&"
                    className="aspect-square object-contain object-center w-6 overflow-hidden"
                />
            </div>
        </div>
    );
}

export default ImageGallery;