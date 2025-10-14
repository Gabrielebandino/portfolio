import React, { useEffect, useState, useRef } from "react";
import "../assets/styles/Creativity.scss";
import VideoPlayer from "./VideoPlayer";
import logo from "../assets/images/b2s/logob2sAsset 1.svg";

function Creativity() {
  // Memoize image imports so they are stable across renders
  const images = React.useMemo(() => {
    try {
      // @ts-ignore - require.context is available in CRA webpack
      const req: any = require;
      // only import numbered b2s images (b2s0.jpg ... b2s6.jpg). Exclude logo SVGs
      const ctx = req.context("../assets/images/b2s", false, /\.(png|jpe?g)$/);
      const rawKeys: string[] = ctx
        .keys()
        .filter((k: string) => /^\.\/b2s\d+\.(png|jpe?g)$/i.test(k));
      const keyed: { key: string; src: any }[] = rawKeys.map((k: string) => ({
        key: k,
        src: ctx(k),
      }));

      const extractNum = (k: string) => {
        const m = k.match(/b2s(\D*?)(\d+)\./i) || k.match(/(\d+)/);
        return m ? parseInt(m[m.length - 1], 10) : 0;
      };

      keyed.sort((a, b) => extractNum(a.key) - extractNum(b.key));

      const resolveSrc = (item: any) =>
        item && item.default ? item.default : item;

      return keyed.map((x) => resolveSrc(x.src));
    } catch (e) {
      return [] as string[];
    }
  }, []);

  const [index, setIndex] = useState(0);
  const [navLocked, setNavLocked] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Ensure index is valid if images array changes
  useEffect(() => {
    if (images.length === 0) {
      setIndex(0);
    } else if (index >= images.length) {
      setIndex(0);
    }
  }, [images.length]);

  const prev = () => {
    if (images.length === 0) return;
    if (navLocked) return;
    setNavLocked(true);
    setIsFading(true);
    // fade duration 260ms, then update index
    window.setTimeout(() => {
      setIndex((i) => (i - 1 + images.length) % images.length);
      setIsFading(false);
      // keep a small lock so user can't spam
      window.setTimeout(() => setNavLocked(false), 120);
    }, 260);
  };

  const next = () => {
    if (images.length === 0) return;
    if (navLocked) return;
    setNavLocked(true);
    setIsFading(true);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
      setIsFading(false);
      window.setTimeout(() => setNavLocked(false), 120);
    }, 260);
  };

  const supportedArtists = ["Central Cee", "Cris MJ", "NLE Choppa", "Rochy RD"];

  return (
    <div className="container" id="creativity">
      <div className="creativity-container">
        <h1 className="section-title creativity">Creativity</h1>

        <div className="creativity-grid">
          <div className="text-column">
            <div className="glass-card">
              <div className="brand-header">
                <img src={logo} alt="Born2Shine" className="b2s-logo" />
                <h3>Co-Founder &amp; Creative Director</h3>
              </div>

              <h4 className="creativity-company">
                <a
                  href="https://rxborntoshine.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Born2Shine
                </a>
              </h4>

              <p>
                Born2Shine is an upcoming lifestyle & apparel brand based in
                Italy focused on bold visual storytelling and limited drops. As
                Co-Founder and Creative Director I lead design, campaigns and
                artist collaborations to craft elevated brand experiences.
              </p>

              <h4>Supported / Featured by</h4>
              <p className="artists-inline">
                {supportedArtists.map((a) => (
                  <span key={a} className="artist-name">
                    {a}
                  </span>
                ))}
              </p>

              <p className="note">
                The visuals show behind-the-scenes and campaign material. Use
                the arrows to browse.
              </p>
            </div>
          </div>

          <div className="media-column">
            <div className="video-half">
              <VideoPlayer />
            </div>
          </div>
        </div>
        {images.length > 0 && (
          <div className="carousel-wrapper">
            <button
              className="carousel-arrow left"
              onClick={prev}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className={`carousel-inner ${isFading ? "fading" : ""}`}>
              {(() => {
                const len = images.length;
                if (len === 0) return null;
                if (len === 1) {
                  return (
                    <div
                      className={`slide active`}
                      style={{ backgroundImage: `url(${images[0]})` }}
                    />
                  );
                }
                if (len === 2) {
                  const i0 = index % len;
                  const i1 = (index + 1) % len;
                  return (
                    <>
                      <div
                        className={`slide prev`}
                        style={{ backgroundImage: `url(${images[i0]})` }}
                      />
                      <div
                        className={`slide active`}
                        style={{ backgroundImage: `url(${images[i1]})` }}
                      />
                    </>
                  );
                }
                const prevIndex = (index - 1 + len) % len;
                const nextIndex = (index + 1) % len;
                return (
                  <>
                    <div
                      className={`slide prev`}
                      style={{ backgroundImage: `url(${images[prevIndex]})` }}
                    />
                    <div
                      className={`slide active`}
                      style={{ backgroundImage: `url(${images[index]})` }}
                    />
                    <div
                      className={`slide next`}
                      style={{ backgroundImage: `url(${images[nextIndex]})` }}
                    />
                  </>
                );
              })()}
            </div>

            <button
              className="carousel-arrow right"
              onClick={next}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Creativity;
