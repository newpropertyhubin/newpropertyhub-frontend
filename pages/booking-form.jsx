import { useState } from "react";
import { uploadFile } from "../services/uploadApi";
import { createOrder as createPaymentOrder } from "../services/paymentApi";

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    guests: 1,
    amount: 1000, // default booking advance
  });

  const [idProof, setIdProof] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [uploadedIdUrl, setUploadedIdUrl] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload ID Proof
  const handleIdUpload = async () => {
    if (!idProof) return alert("Please select an ID proof");
    const url = await uploadFile(idProof);
    setUploadedIdUrl(url);
    alert("ID Proof Uploaded!");
  };

  // Upload Property Images
  const handleImageUpload = async () => {
    if (propertyImages.length === 0) return alert("Please select property images");
    const urls = await uploadFile(propertyImages);
    setUploadedImageUrls(urls);
    alert("Property Images Uploaded!");
  };

  // Handle Payment
  const handlePayment = async () => {
    const { data } = await createPaymentOrder(form.amount);

    const options = {
      key: "YOUR_RAZORPAY_KEY", // 🔴 Replace with real key
      amount: data.amount,
      currency: "INR",
      name: "MyPropertyHub",
      description: "Booking Advance Payment",
      order_id: data.id,
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // TODO: Save booking data to backend
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Book Your Stay</h2>

      <input type="text" name="name" placeholder="Full Name" className="w-full border p-2 mb-2"
        value={form.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" className="w-full border p-2 mb-2"
        value={form.email} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" className="w-full border p-2 mb-2"
        value={form.phone} onChange={handleChange} />

      <label>Check-In:</label>
      <input type="date" name="checkin" className="w-full border p-2 mb-2"
        value={form.checkin} onChange={handleChange} />

      <label>Check-Out:</label>
      <input type="date" name="checkout" className="w-full border p-2 mb-2"
        value={form.checkout} onChange={handleChange} />

      <input type="number" name="guests" placeholder="Guests" className="w-full border p-2 mb-2"
        value={form.guests} onChange={handleChange} />

      {/* ID Proof Upload */}
      <div className="mb-2">
        <label>ID Proof:</label>
        <input type="file" onChange={(e) => setIdProof(e.target.files[0])} />
        <button onClick={handleIdUpload} className="bg-blue-500 text-white px-3 py-1 rounded ml-2">Upload</button>
        {uploadedIdUrl && <p className="text-green-600">Uploaded ✔</p>}
      </div>

      {/* Property Images Upload */}
      <div className="mb-2">
        <label>Property Images:</label>
        <input type="file" multiple onChange={(e) => setPropertyImages([...e.target.files])} />
        <button onClick={handleImageUpload} className="bg-blue-500 text-white px-3 py-1 rounded ml-2">Upload</button>
        {uploadedImageUrls.length > 0 && <p className="text-green-600">{uploadedImageUrls.length} Images Uploaded ✔</p>}
      </div>

      {/* Payment */}
      <div className="mt-4">
        <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Pay ₹{form.amount} & Confirm Booking
        </button>
      </div>
    </div>
  );
}