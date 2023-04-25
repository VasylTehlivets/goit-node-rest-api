const Jimp = require("jimp");

const jimpAvatarResizer = async (req, res, next) => {
  const { path: tmpUpload } = req.file;

  Jimp.read(tmpUpload)
    .then((image) => {
      return image.resize(250, 250).write(tmpUpload);
    })
    .then(() => {
      next();
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { jimpAvatarResizer };
