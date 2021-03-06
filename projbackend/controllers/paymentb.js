var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "vzk23cgy6sb9s6rw",
  publicKey: "4rsxdqmtk8fjr5zj",
  privateKey: "af6dab2c6ff6cd2ae33d95f6d9aa0adb"
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement: true
      }
    },
    function (err, result) {
      if (err) {
        res.status(500).json(error);
      } else {
        console.log(result);
        res.json(result);
      }
    }
  );
};