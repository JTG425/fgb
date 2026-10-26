import { useState } from "react";
import PropTypes from "prop-types";
import { posterImageUrl } from "../lib/posters";

export default function PosterImage({ imageUrl, title, detail = false }) {
  // Track the failed URL rather than a boolean so a replacement image can load.
  const [failedUrl, setFailedUrl] = useState(null);
  const source = posterImageUrl(imageUrl, detail ? 1200 : 640);
  const available = source && failedUrl !== source;
  const responsive = available && source.includes("drive.google.com/thumbnail?")
    ? [320, 640, 1200].map((width) => `${posterImageUrl(imageUrl, width)} ${width}w`).join(", ")
    : undefined;

  return (
    <img
      src={available ? source : "/poster-placeholder.svg"}
      srcSet={responsive}
      sizes={detail
        ? "(max-width: 675px) 230px, 350px"
        : "(max-width: 675px) 46vw, (max-width: 900px) 30vw, 260px"}
      alt={available ? `${title} — poster photograph` : `Photograph unavailable for ${title}`}
      loading={detail ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      width="450"
      height="800"
      onError={available ? () => setFailedUrl(source) : undefined}
    />
  );
}

PosterImage.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  detail: PropTypes.bool,
};
