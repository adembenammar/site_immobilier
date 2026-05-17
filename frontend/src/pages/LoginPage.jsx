import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/common/BrandLogo";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@tentation-immobiliere.com", password: "password123" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion impossible");
    }
  };

  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-lg rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <BrandLogo withText={false} />
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-bronze">Admin login</p>
        <h1 className="mt-3 font-display text-4xl">Accedez au dashboard de Tentation Immobiliere.</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="input-ui"
            type="email"
            placeholder="Email admin"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="input-ui"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <button type="submit" className="btn-primary w-full">
            Se connecter
          </button>
          <p className="text-sm text-rose-500">{error}</p>
        </form>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Aucune inscription publique n'est disponible.</p>
      </div>
    </section>
  );
};

export default LoginPage;
