import React, { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../pages/TopBar"; // Ensure the import path is correct
import success from "../assets/success.png";

function UserSelect() {
  const [selected, setSelected] = useState("");
  const [customUser, setCustomUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="h-full flex">
      {/* Fixed TopBar to the left */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "200px", zIndex: 1000 }}>
        <TopBar />
      </div>

      {/* Centered content container with increased width */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[1800px] mx-auto"> {/* Increased max-width here */}
          <h1 className="text-2xl font-semibold text-center mb-6">Upload User Image</h1>
          <div className="w-full p-4 text-right">
            <div className="mx-auto w-full max-w-[1800px]"> {/* Increased max-width here */}
              {/* Card with larger width */}
              <div className="card-container p-10 rounded-lg shadow-xl bg-white relative z-10 w-full max-w-[2200px] sm:max-w-[1500px]">
              {!customUser && (
                  <div className="flex flex-col items-center justify-center w-full mt-3">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-200 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-indigo-500 mb-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          />
                        </svg>
                        <p className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Click to upload referral image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or JPEG
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (files == null || files.length === 0) {
                            setErrorMessage("No files selected.");
                            return;
                          }
                          let file = files[0];
                          let name = file.name;
                          let suffixArr = name.split("."),
                            suffix = suffixArr[suffixArr.length - 1];
                          if (suffix !== "png" && suffix !== "jpg" && suffix !== "jpeg") {
                            setErrorMessage("Only support png, jpg or jpeg files.");
                            return;
                          }

                          const base64 = await convertBase64(file);

                          const user = {
                            id: "custom",
                            fullName: name,
                            type: "CUSTOM",
                            picture: base64,
                          };

                          setCustomUser(user);
                          setSelected(user);
                        }}
                      />
                    </label>
                    {errorMessage && (
                      <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                    )}
                  </div>
                )}
                {customUser && (
                  <img
                    src={success}
                    alt="success"
                    className="success-icon"
                  />
                )}
                <Link
                  to="/face"
                  state={{ account: selected }}
                  className="mt-4 inline-flex items-center rounded-md bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
                >
                  Continue
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="ml-1.5 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSelect;
