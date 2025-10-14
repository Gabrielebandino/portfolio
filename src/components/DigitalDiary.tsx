import React from "react";
import "../assets/styles/DigitalDiary.scss";

function DigitalDiary() {
  // PREPARED METADATA for video1..video5 — edit these titles/dates manually as needed.
  // Keep keys as the base filename (without extension) e.g. "video1"
  const VIDEO_META: Record<string, { title: string; date: string }> = {
    video1: {
      title: "Boat Trip in La Maddalena",
      date: "12 Aug 2025",
    },
    video2: { title: "Day Trip at S'Archittu", date: "10 Sept 2025" },
    video3: { title: "First day in Milan", date: "14 Sept 2025" },
    video4: { title: "First day at PoliMi", date: "15 Sept 2025" },
    video5: { title: "Day Trip in Turin", date: "29 Sept 2025" },
  };

  // load videos video1.mp4 ... and attach metadata; keep deterministic order and limit to the first 5 prepared entries
  const videos = React.useMemo(() => {
    try {
      // @ts-ignore
      const req: any = require;
      const ctx = req.context("../assets/videos", false, /video\d+\.mp4$/);
      const keyed: { key: string; name: string; src: any }[] = ctx
        .keys()
        .map((k: string) => {
          const name = k.replace(/^\.\//, "").replace(/\.mp4$/i, "");
          return { key: k, name, src: ctx(k) };
        });

      keyed.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );

      const resolve = (m: any) => (m && m.default ? m.default : m);

      // map to objects with src and metadata (fallback to simple title/date if not provided)
      const mapped = keyed.map((k) => ({
        name: k.name,
        src: resolve(k.src),
        meta: VIDEO_META[k.name] || { title: k.name, date: "" },
      }));

      // keep only the first 5 entries (video1..video5) in the prepared order
      const desired = ["video1", "video2", "video3", "video4", "video5"];
      const final = desired
        .map((n) => mapped.find((m) => m.name === n))
        .filter(Boolean) as {
        name: string;
        src: string;
        meta: { title: string; date: string };
      }[];

      return final;
    } catch (e) {
      return [] as {
        name: string;
        src: string;
        meta: { title: string; date: string };
      }[];
    }
  }, []);

  const [index, setIndex] = React.useState(0);
  const [navLocked, setNavLocked] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);

  React.useEffect(() => {
    if (videos.length === 0) setIndex(0);
    else if (index >= videos.length) setIndex(0);
  }, [videos.length]);

  const prev = () => {
    if (videos.length === 0 || navLocked) return;
    setNavLocked(true);
    setIsFading(true);
    setTimeout(() => {
      setIndex((i) => (i - 1 + videos.length) % videos.length);
      setIsFading(false);
      setTimeout(() => setNavLocked(false), 120);
    }, 260);
  };

  const next = () => {
    if (videos.length === 0 || navLocked) return;
    setNavLocked(true);
    setIsFading(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % videos.length);
      setIsFading(false);
      setTimeout(() => setNavLocked(false), 120);
    }, 260);
  };

  // simple titles/dates assumptions: "Diary — n" and today's date (lowercase)
  const today = new Date();
  const dateStr = today
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toLowerCase();

  return (
    <div className="container" id="digital-diary">
      <div className="digital-diary-container">
        <h1 className="section-title diary">Digital Diary</h1>

        {videos.length > 0 && (
          <div className="diary-carousel-wrapper">
            <button
              className="carousel-arrow left"
              onClick={prev}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className={`diary-carousel-inner ${isFading ? "fading" : ""}`}>
              {(() => {
                const len = videos.length;
                if (len === 1) {
                  const v = videos[0];
                  return (
                    <div className="diary-slide active">
                      <video
                        src={v.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="diary-video"
                      />
                      <div className="diary-meta">
                        <div className="diary-title">
                          {v.meta?.title || `Diary — 1`}
                        </div>
                        <div className="diary-date">
                          {v.meta?.date || dateStr}
                        </div>
                      </div>
                    </div>
                  );
                }
                if (len === 2) {
                  const i0 = index % len;
                  const i1 = (index + 1) % len;
                  const v0 = videos[i0];
                  const v1 = videos[i1];
                  return (
                    <>
                      <div className="diary-slide prev">
                        <video
                          src={v0.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className="diary-video"
                        />
                        <div className="diary-meta">
                          <div className="diary-title">
                            {v0.meta?.title || `Diary — ${i0 + 1}`}
                          </div>
                          <div className="diary-date">
                            {v0.meta?.date || dateStr}
                          </div>
                        </div>
                      </div>
                      <div className="diary-slide active">
                        <video
                          src={v1.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className="diary-video"
                        />
                        <div className="diary-meta">
                          <div className="diary-title">
                            {v1.meta?.title || `Diary — ${i1 + 1}`}
                          </div>
                          <div className="diary-date">
                            {v1.meta?.date || dateStr}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                const prevIndex = (index - 1 + len) % len;
                const nextIndex = (index + 1) % len;
                const vp = videos[prevIndex];
                const va = videos[index];
                const vn = videos[nextIndex];
                return (
                  <>
                    <div className="diary-slide prev">
                      <video
                        src={vp.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="diary-video"
                      />
                      <div className="diary-meta">
                        <div className="diary-title">
                          {vp.meta?.title || `Diary — ${prevIndex + 1}`}
                        </div>
                        <div className="diary-date">
                          {vp.meta?.date || dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="diary-slide active">
                      <video
                        src={va.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="diary-video"
                      />
                      <div className="diary-meta">
                        <div className="diary-title">
                          {va.meta?.title || `Diary — ${index + 1}`}
                        </div>
                        <div className="diary-date">
                          {va.meta?.date || dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="diary-slide next">
                      <video
                        src={vn.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="diary-video"
                      />
                      <div className="diary-meta">
                        <div className="diary-title">
                          {vn.meta?.title || `Diary — ${nextIndex + 1}`}
                        </div>
                        <div className="diary-date">
                          {vn.meta?.date || dateStr}
                        </div>
                      </div>
                    </div>
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

export default DigitalDiary;
