import React, { useState } from "react";
import CryptoJS from "crypto-js";

const ChangeWords = () => {
  const [key, setKey] = useState(""); // Key used for encryption and decryption
  const [inputTextForEncryption, setInputTextForEncryption] = useState(""); // Text to be encrypted
  const [encryptedText, setEncryptedText] = useState(""); // Encrypted text

  const [inputTextForDecryption, setInputTextForDecryption] = useState(""); // Text to be decrypted
  const [decryptedText, setDecryptedText] = useState(""); // Decrypted text

  // Tooltip states
  const [showTooltipEncryption, setShowTooltipEncryption] = useState(false);
  const [showTooltipDecryption, setShowTooltipDecryption] = useState(false);

  const getValidKey = (inputKey) => {
    return CryptoJS.SHA256(inputKey).toString(CryptoJS.enc.Base64); // Convert the input key to a valid 32-byte key
  };

  const encryptText = () => {
    if (key && inputTextForEncryption) {
      try {
        const validKey = getValidKey(key); // Hash the input key into a 32-byte key
        const ciphertext = CryptoJS.AES.encrypt(
          inputTextForEncryption,
          validKey
        ).toString();
        setEncryptedText(ciphertext); // Save the encrypted text in the state
      } catch (error) {
        alert("An error occurred during encryption. Please try again.");
      }
    } else {
      alert("Please enter the encryption key and text.");
    }
  };

  const decryptText = () => {
    if (key && inputTextForDecryption) {
      try {
        const validKey = getValidKey(key); // Hash the input key into a 32-byte key
        const bytes = CryptoJS.AES.decrypt(inputTextForDecryption, validKey);

        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) {
          throw new Error(
            "Decryption failed: The key is incorrect or the data is corrupted."
          );
        }
        setDecryptedText(originalText); // Save the decrypted text in the state
      } catch (error) {
        alert(error.message); // Show error message in an alert
      }
    } else {
      alert("Please enter the decryption key and the encrypted text.");
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // tooltip
        if (type === "encryption") {
          setShowTooltipEncryption(true);
          setTimeout(() => {
            setShowTooltipEncryption(false); // Hide after 1 second
          }, 1000);
        } else if (type === "decryption") {
          setShowTooltipDecryption(true);
          setTimeout(() => {
            setShowTooltipDecryption(false); // Hide after 1 second
          }, 1000);
        }
      })
      .catch((err) => {
        alert("Copy failed: " + err);
      });
  };

  const pasteFromClipboard = async (type) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (type === "encryption") {
        setInputTextForEncryption(clipboardText);
      } else if (type === "decryption") {
        setInputTextForDecryption(clipboardText);
      }
    } catch (err) {
      alert("Failed to paste text from the clipboard.");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-gray-50 via-blue-100 to-gray-50 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Stalk: AES Encryption/Decryption Tool
        </h2>
        {/* Key Setup Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Key Setup</h3>
          {/* key input */}
          <div className="mb-4">
            <label
              htmlFor="key"
              className="block text-sm font-medium text-gray-700 mb-2"
            ></label>
            <input
              type="text"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Please enter the encryption key."
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        {/* Encryption Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">
            Encryption
          </h3>
          {/* Input for text to encrypt */}
          <div className="mb-4">
            <label
              htmlFor="inputTextForEncryption"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {/* Text to encrypt */}
            </label>
            <textarea
              id="inputTextForEncryption"
              value={inputTextForEncryption}
              onChange={(e) => setInputTextForEncryption(e.target.value)}
              placeholder="Please enter the text to encrypt."
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          {/* Encrypt and Paste buttons */}
          <div className="mb-6 flex justify-between">
            <button
              onClick={encryptText}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Encrypt
            </button>
            <button
              onClick={() => pasteFromClipboard("encryption")}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            >
              Paste
            </button>
          </div>
          {/* Display your encrypted text */}
          <div className="mb-4">
            <textarea
              value={encryptedText}
              readOnly
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {/* Copy Button */}
            <div className="relative inline-block">
              <button
                onClick={() => copyToClipboard(encryptedText, "encryption")}
                className="mt-2 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Copy
              </button>
              {/* tooltip */}
              {showTooltipEncryption && (
                <div className="absolute left-full top-0 ml-2 px-2 py-1 text-white bg-gray-600 rounded-md text-sm transition-opacity duration-300 opacity-100 animate__fadeIn animate__animated">
                  copied!
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decryption Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">
            Decryption
          </h3>
          {/* Input for text to decrypt */}
          <div className="mb-4">
            <label
              htmlFor="inputTextForDecryption"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {/* Text to decrypt */}
            </label>
            <textarea
              id="inputTextForDecryption"
              value={inputTextForDecryption}
              onChange={(e) => setInputTextForDecryption(e.target.value)}
              placeholder="Please enter the text to decrypt."
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          {/* Decrypt and Paste buttons */}
          <div className="mb-6 flex justify-between">
            <button
              onClick={decryptText}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            >
              Decrypt
            </button>
            <button
              onClick={() => pasteFromClipboard("decryption")}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            >
              Paste
            </button>
          </div>
          {/* Display your decrypted text */}
          <div className="mb-4">
            <textarea
              value={decryptedText}
              readOnly
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {/* Copy Button */}
            <div className="relative inline-block">
              <button
                onClick={() => copyToClipboard(decryptedText, "decryption")}
                className="mt-2 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Copy
              </button>
              {/* tooltip */}
              {showTooltipDecryption && (
                <div className="absolute left-full top-0 ml-2 px-2 py-1 text-white bg-gray-600 rounded-md text-sm transition-opacity duration-300 opacity-100 animate__fadeIn animate__animated">
                  copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeWords;
