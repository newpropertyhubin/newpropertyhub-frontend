import { createOrder } from "../api/paymentApi";

export default function PayButton({ amount }) {
  const handlePayment = async () => {
    const { data } = await createOrder(amount);

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      name: "MyPropertyHub",
      description: "Booking Advance",
      order_id: data.id,
      handler: function (response) {
        alert("Payment successful! ID: " + response.razorpay_payment_id);
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment} className="bg-green-500 text-white px-4 py-2 rounded">
      Pay ₹{amount}
    </button>
  );
}