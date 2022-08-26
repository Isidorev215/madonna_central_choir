const { Router } = require('express')
const router = Router();
const { ensureAuthentication } = require('../config/auth');


router.get('/config', ensureAuthentication, (req, res, next) => {
  res.send({
    status: 'OK',
    data: {
      ...req.user
    }
  })
})

module.exports = router;
