import md5 from 'md5'
import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'

const admins = JSON.parse((process.env.ADMINS).replace(/\'/g, '"'))

//t is an object with fields "likes" and "views" for the current state.
//y is an object with the same fields for a past state in the last cron update
function testTrend(t, y) {
  let T = (t.likes / (t.views + 1) * (t.likes + 5));
  let Y = (y.likes / (y.views + 1) * (y.likes + 5));
  let Z = 10;
  if (T - Y <= 0) {
    Z -= Math.abs(T - Y);
  } else {
    Z += Math.abs(T - Y) / 2;
  }
  return (Number(Z.toFixed(2)))
}

const limiter = (time, max, handler) => {
  return rateLimit({
    windowMs: time,
    max: max,
    handler: handler || function (req, res, /*next*/) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts.  Please try again later.'
      })
    },
    keyGenerator: function (req, res) {
      return requestIp.getClientIp(req);
    }
  })
};


export { md5, admins, testTrend, limiter }