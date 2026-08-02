import "../componentstyles/prices.css";

const prices = {
  Standard: {
    Adult: "$12.84",
    Child: "$9.63",
    Senior: "$9.37",
    Military: "$9.37",
  },
  Matinee: {
    Adult: "$9.37",
    Child: "$9.37",
    Senior: "$9.37",
    Military: "$9.37",
  },
};

function Prices() {
  return (
    <div className="prices" aria-label="Published ticket prices">
      {Object.entries(prices).map(([showType, ticketPrices]) => (
        <section className="showtype" key={showType}>
          <div className="showtype-heading">
            <h3>{showType}</h3>
          </div>
          <dl className="price-list">
            {Object.entries(ticketPrices).map(([ticketType, price]) => (
              <div key={ticketType} className="price-item">
                <dt>{ticketType}</dt>
                <dd>{price}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export default Prices;
