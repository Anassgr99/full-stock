import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import loginAnimation from "./Animation - 1743792049195.json";
import { Player } from "@lottiefiles/react-lottie-player";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  const seConnecter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.simotakhfid.ma/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: motDePasse }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.user.isAdmin);
        localStorage.setItem("store", data.user.store);
        localStorage.setItem("userInfo", data.user.name);

        navigate(data.user.isAdmin === 0 ? "/" : "/isStore");
      } else {
        setErreur(data.error || "Identifiants invalides.");
      }
    } catch {
      setErreur("Une erreur est survenue.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative font-sans overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0"></div>
    <div className="absolute w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-[180px] top-1/3 left-[-200px] z-0 animate-pulse-slow"></div>
    <div className="absolute w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px] bottom-10 right-[-150px] z-0 animate-pulse-slow"></div>
  
    <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 z-0">
      <svg viewBox="0 0 1200 120" className="w-full h-24 fill-[#1e293b]">
        <path d="M0,0 C300,80 900,20 1200,90 L1200,0 L0,0 Z" />
      </svg>
    </div>
  
    <div className="absolute top-10 left-6 bg-white/5 text-white text-xs px-4 py-1 rounded-full backdrop-blur-md border border-white/20 shadow animate-fade z-20">
      🚀 Nouvelle version disponible
    </div>
  
    <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-1 shadow-2xl max-w-6xl w-full mx-4">
      <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-[#0f172a]">
  
        <div className="md:w-1/2 w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-r border-white/10">
          <Player
            src={loginAnimation}
            background="transparent"
            speed={1}
            autoplay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </div>
  
        <div className="md:w-1/2 w-full px-10 py-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-fit mx-auto">
              <img src={logo} alt="Logo Amasys" className="w-40 mb-1 drop-shadow-lg" />
              <span className="absolute -top-2 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-xs text-black px-2 py-0.5 rounded-full animate-ping-slow">
                PRO
              </span>
            </div>
  
            <h2 className="text-white text-3xl font-bold text-center tracking-wide">
              <span className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-white pr-2">
                Bienvenue chez Amasys
              </span>
            </h2>
  
            {erreur && (
              <p className="text-red-500 text-sm text-center">{erreur}</p>
            )}
  
            <form onSubmit={seConnecter} className="w-full space-y-5">
              <div>
                <label className="block text-sm text-white mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                  placeholder="Ex : contact@amasys.ma"
                />
              </div>
  
              <div>
                <label className="block text-sm text-white mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                  placeholder="••••••••"
                />
              </div>
  
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg font-semibold shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Connexion</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  
    <div className="absolute bottom-3 w-full text-center text-xs text-white/30 animate-pulse z-10">
      © 2025 Amasys – Interface développée avec ❤️ au Maroc
    </div>
  </div>
  
  );
  
};

export default Login;
