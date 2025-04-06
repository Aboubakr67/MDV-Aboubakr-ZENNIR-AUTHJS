import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/user/generate-otp-secret",
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (data.success) {
          setQrCode(data.qrCode); 
        } else {
          setError("Impossible de générer le QR Code.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération du QR Code.");
      }
    };

    fetchQrCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otpCode }),
    });

    const data = await res.json();

    if (data.success) {
      navigate("/intervenant-list");
    } else {
      setError("Code incorrect.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Vérification OTP</h2>

      {/* QR CODE */}
      {qrCode && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Scanne ce QR code avec Google Authenticator :
          </p>
          <img src={qrCode} alt="QR Code" className="mx-auto w-40 h-40" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Code à 6 chiffres"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Vérifier
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default OtpVerify;
