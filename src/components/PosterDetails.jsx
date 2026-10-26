import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FiCheckCircle, FiArrowUpRight } from "react-icons/fi";
import PosterDialog from "./PosterDialog";
import PosterImage from "./PosterImage";
import { posterPrice, validateRequest } from "../lib/posters";
import { submitPosterRequest } from "../services/posterService";

export default function PosterDetails({ poster, onClose, available }) {
  const [form, setForm] = useState({ customerName: "", phone: "", comments: "", website: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const requestId = useRef(crypto.randomUUID());
  const price = posterPrice(poster);
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current || !available || poster.quantity < 1 || !poster.active) return;
    const validation = validateRequest(form);
    if (validation) { setError(validation); return; }
    if (form.website) { setError("Unable to send this request. Please try again."); return; }
    submitting.current = true;
    setError("");
    setState("sending");
    try {
      await submitPosterRequest({ ...form, id: requestId.current, posterId: poster.id, posterTitle: poster.title, catalogNumber: poster.catalogNumber });
      setState("sent");
    } catch {
      setState("idle");
      setError("We couldn’t confirm your request. Please retry. If the problem continues, contact the theater before sending another request.");
    } finally { submitting.current = false; }
  };
  return (
    <PosterDialog onClose={onClose} labelledBy="poster-detail-title">
      <div className="poster-detail-grid">
        <div className="poster-detail-art">
          <PosterImage imageUrl={poster.imageUrl} title={poster.title} detail />
          <span>Catalog reference {poster.id}</span>
        </div>
        <div className="poster-detail-copy">
          <span className="section-eyebrow">The theater collection</span>
          <h2 id="poster-detail-title">{poster.title}</h2>
          <p className="poster-detail-meta">{poster.year || "Year not recorded"} · {poster.quantity > 0 ? `${poster.quantity} available` : "Out of stock"}</p>
          <div className="poster-detail-price"><strong>{price.value}</strong><span>{price.label} per poster</span></div>
          <dl className="poster-specs">
            <div><dt>Poster type</dt><dd>{poster.posterType || "Not recorded"}</dd></div>
            <div><dt>Size</dt><dd>{poster.size || "Not recorded"}</dd></div>
            <div><dt>Condition</dt><dd>{poster.condition || "Contact us for condition details."}</dd></div>
          </dl>
          {poster.description && <details className="poster-notes"><summary>About this poster</summary><p>{poster.description}</p></details>}
          {poster.provenance && <details className="poster-notes"><summary>Provenance & history</summary><p>{poster.provenance}</p></details>}
          <section className="poster-request" aria-labelledby="request-heading">
            {state === "sent" ? <div className="poster-success" role="status"><FiCheckCircle aria-hidden="true" /><h3>Request received</h3><p>Thank you, {form.customerName.trim()}. The theater will contact you at {form.phone} to discuss this poster, confirm the price, and arrange the purchase.</p><p>Your request does not reserve the poster or take payment.</p><button className="shop-button" onClick={onClose}>Back to the collection</button></div> : <>
              <h3 id="request-heading">Request this poster</h3>
              <p>Interested? Leave your details and the theater will follow up about availability, the final price, and collection. No payment is taken here.</p>
              {!available && <p className="shop-notice" role="status">Purchase requests are temporarily unavailable. Please try again later.</p>}
              {poster.quantity < 1 ? <p className="shop-notice">This poster is currently out of stock.</p> : <form onSubmit={submit} className="shop-form">
                <div className="shop-form-row">
                  <label>Your name<input name="customerName" autoComplete="name" required maxLength={100} value={form.customerName} onChange={update} /></label>
                  <label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} value={form.phone} onChange={update} /></label>
                </div>
                <label>Comments <span className="field-optional">(optional)</span><textarea name="comments" rows={3} maxLength={2000} placeholder="Questions about condition, quantities, or collecting your poster…" value={form.comments} onChange={update} /></label>
                <label className="poster-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} /></label>
                {error && <p className="shop-error" role="alert">{error}</p>}
                <button type="submit" className="shop-button" disabled={!available || state === "sending"}>{state === "sending" ? "Sending request…" : "Send purchase request"}<FiArrowUpRight aria-hidden="true" /></button>
                <small>Your contact details are only visible to theater staff handling your request.</small>
              </form>}
            </>}
          </section>
        </div>
      </div>
    </PosterDialog>
  );
}
PosterDetails.propTypes = { poster: PropTypes.object.isRequired, onClose: PropTypes.func.isRequired, available: PropTypes.bool.isRequired };
