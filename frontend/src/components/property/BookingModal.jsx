import { useState } from "react";
import { X, CalendarCheck, Clock } from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const getNextDays = (count = 14) => {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d); // exclude Sundays
  }
  return days;
};

const fmtDate = (d) =>
  d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

const BookingModal = ({ property, onClose }) => {
  const toast = useToast();
  const days = getNextDays(14);
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) {
      toast("Veuillez choisir une date et un créneau.", "error");
      return;
    }
    setLoading(true);
    const dateStr = selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    try {
      await api.post("/contacts", {
        ...form,
        propertyId: property.id,
        message: `Bonjour, je souhaite visiter le bien "${property.title}" (${property.city}).\n\nCréneau souhaité : ${dateStr} à ${selectedTime}.\n\nMerci de confirmer ce rendez-vous.`,
      });
      toast("Votre demande de visite a bien été envoyée !", "success");
      onClose();
    } catch (err) {
      const errs = err.response?.data?.errors;
      toast(errs?.length ? errs.map((e) => e.msg).join(" • ") : "Envoi impossible.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-6 dark:border-slate-800">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-bronze">Prise de rendez-vous</p>
            <h2 className="mt-1 font-display text-3xl text-ink dark:text-white">Choisissez un créneau</h2>
            <p className="mt-1 text-sm text-slate-500">{property.title} · {property.city}</p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dates */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <CalendarCheck size={13} className="text-bronze" /> Date souhaitée
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {days.map((d) => (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`rounded-2xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                      selectedDay?.toDateString() === d.toDateString()
                        ? "border-bronze bg-bronze/10 text-bronze"
                        : "border-slate-200 text-slate-600 hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {fmtDate(d)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <Clock size={13} className="text-bronze" /> Heure
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedTime === t
                        ? "border-bronze bg-bronze/10 text-bronze"
                        : "border-slate-200 text-slate-600 hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vos coordonnées</p>
              <input required className="input-ui" placeholder="Nom complet *" value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
              <input required type="email" className="input-ui" placeholder="Email *" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              <input className="input-ui" placeholder="Téléphone" value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>

            {/* Selected summary */}
            {selectedDay && selectedTime && (
              <div className="rounded-2xl bg-forest/8 border border-forest/20 px-5 py-4 text-sm text-forest dark:bg-forest/10 dark:text-mist">
                <span className="font-semibold">Créneau sélectionné :</span>{" "}
                {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full gap-2 disabled:opacity-50"
            >
              <CalendarCheck size={16} />
              {loading ? "Envoi…" : "Confirmer la demande de visite"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
