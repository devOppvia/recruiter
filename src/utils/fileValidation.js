/**
 * Validate file size in MB
 * @param {File} file - The uploaded file
 * @param {number} maxMB - Maximum allowed size in MB
 * @returns {Promise} Resolves if valid, rejects with message if invalid
 */
export const validateFileSize = (file, maxMB) => {
  return new Promise((resolve, reject) => {
    const sizeInMB = file.size / 1024 / 1024;

    if (sizeInMB > maxMB) {
      reject(`File size must be less than ${maxMB} MB`);
    } else {
      resolve(true);
    }
  });
};
