import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const name = params.get("name");
    const email = params.get("email");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("user", JSON.stringify({ name, email }));

      navigate("/admin-panel");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in with Google...</p>;
};

export default GoogleSuccess;
