import axios from "axios";

function PaymentButton({ amount }) {

  const handlePayment = async () => {
    try {

      // Create order from backend
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount,
        }
      );

      // Razorpay options
      const options = {
        key: "rzp_test_SnzgBv270hFwYq",

        amount: data.amount,

        currency: data.currency,

        name: "Kisan Market",

        description: "Farm Product Payment",

        order_id: data.id,

        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (error) {
      console.log(error);

      alert("Payment Failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
    >
      Pay Now
    </button>
  );
}

export default PaymentButton;