
// it is the controllers that communicate with the models
const getConfig = (req, res, next) => {
  res.send({
    status: 'OK',
    data: {
      ...req.user
    }
  })
}

module.exports = {
  getConfig,
}
