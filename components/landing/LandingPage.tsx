import Link from "next/link";
import s from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <div className={s.landing}>
      <div className={s.bg} />
      {/* 
      <div className={`${s.blob} ${s.blobA}`} />
      <div className={`${s.blob} ${s.blobB}`} />
      */}

      <div className={s.screen}>
        <nav className={s.nav}>
          <div className={`${s.brand} ${s.rise} ${s.d1}`}>
            <span className={s.mark}>🍇</span>OpenGrapes
          </div>
          <Link className={`${s.navLogin} ${s.rise} ${s.d1}`} href="/login">
            Log in
          </Link>
        </nav>

        <div className={s.htext}>
          <span className={`${s.eyebrow} ${s.rise} ${s.d1}`}>
            <span className={s.dot} />
            Now with  whiteboard classes
          </span>
          <h1 className={`${s.h1} ${s.rise} ${s.d2}`}>
            Run your classes,<br />
            <span className={s.grad}>one batch at a time.</span>
          </h1>
          <p className={`${s.lede} ${s.rise} ${s.d3}`}>
            Teachers run <b>batches</b>, students join with a code, and live
            lessons happen on a{" "}
            <b>collaborative whiteboard built right in</b> — with notes, tests,
            and fees kept neatly per batch.
          </p>
        </div>

        <div className={`${s.wb} ${s.rise} ${s.d4}`}>
          <div className={s.whiteboard}>
            <div className={s.wbBar}>
              <i className={s.c1} />
              <i className={s.c2} />
              <i className={s.c3} />
              <span className={s.wbBarLabel}>
                <span className={s.live} />
                2 people drawing · live
              </span>
            </div>
            <div className={s.wbCanvas}>
              <div className={s.wbTools}>
                <b className={s.toolP} />
                <b className={s.toolG} />
                <b className={s.toolO} />
              </div>
              <svg viewBox="0 0 460 248" preserveAspectRatio="none">
                <path
                  className={`${s.ink} ${s.inkV}`}
                  d="M70 130 q40 -85 80 0 t80 0"
                />
                <path
                  className={`${s.ink} ${s.inkV}`}
                  d="M70 188 h300"
                />
                <path
                  className={`${s.ink} ${s.inkT}`}
                  d="M255 80 l28 28 m0 -28 l-28 28"
                />
                <path
                  className={`${s.ink} ${s.inkT}`}
                  d="M300 132 q35 -52 70 -8"
                />
              </svg>
              <div className={`${s.cursor} ${s.cur1}`}>Ms. Rao</div>
              <div className={`${s.cursor} ${s.cur2}`}>Aarav</div>
            </div>
          </div>
        </div>

        <div className={s.cards}>
          <div className={`${s.cardsHead} ${s.rise} ${s.d4}`}>
            <span className={s.cardsHeadEb}>Get started</span>
            <span className={s.cardsHeadHint}>Choose the option that fits you — it only takes a second.</span>
          </div>
          <Link
            className={`${s.card} ${s.cViolet} ${s.heroCard} ${s.rise} ${s.d5}`}
            href="/signup"
          >
            <div className={s.cardTop}>
              <div className={s.chip}>🎓</div>
              <span className={s.cardEyebrow}>Teacher</span>
            </div>
            <h3>Create a batch</h3>
            <p>Set up your class and invite students with a code.</p>
            <span className={s.cta}>Create a batch <span className={s.ctaAr}>→</span></span>
          </Link>
          <Link
            className={`${s.card} ${s.cTeal} ${s.rise} ${s.d6}`}
            href="/join"
          >
            <div className={s.cardTop}>
              <div className={s.chip}>✲</div>
              <span className={s.cardEyebrow}>Student</span>
            </div>
            <h3>Join a batch</h3>
            <p>Enter your class code and you&apos;re in.</p>
            <span className={s.cta}>Join with a code <span className={s.ctaAr}>→</span></span>
          </Link>
          <Link
            className={`${s.card} ${s.cSlate} ${s.rise} ${s.d7}`}
            href="/login"
          >
            <div className={s.cardTop}>
              <div className={s.chip}>☺</div>
              <span className={s.cardEyebrow}>Returning</span>
            </div>
            <h3>Log in</h3>
            <p>Pick up right where you left off.</p>
            <span className={s.cta}>Log in <span className={s.ctaAr}>→</span></span>
          </Link>
        </div>
      </div>

      <div className={s.below}>
        <div className={s.sect}>
          <div className={s.eb}>Everything in one place</div>
          <h2>One calm home for learning &amp; teaching</h2>
          <p>
            Built for both sides of the classroom — and getting smarter.
          </p>
        </div>

        <div className={s.highlights}>
          <div className={`${s.hl} ${s.hlWb}`}>
            <div className={s.hlIc}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h20v14H2z" />
                <path d="M7 21h10M12 17v4" />
                <path d="M6 10l3 3 5-6" />
              </svg>
            </div>
            <h3>Live whiteboard classes</h3>
            <p>
              Teach live on a shared canvas — draw, annotate and solve together
              in real time, right inside your batch.
            </p>
          </div>
          <div className={`${s.hl} ${s.hlAi}`}>
            <div className={s.hlIc}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6z" />
                <path d="M18.5 13l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
              </svg>
            </div>
            <h3>
              AI that knows your class <span className={s.soon}>Soon</span>
            </h3>
            <p>
              An assistant that understands your batch&apos;s material, so
              students get instant, context-aware help with their doubts — with
              you in the loop.
            </p>
          </div>
          <div className={`${s.hl} ${s.hlFee}`}>
            <div className={s.hlIc}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18M7 15h4" />
              </svg>
            </div>
            <h3>
              Fees on autopilot <span className={s.soon}>Soon</span>
            </h3>
            <p>
              Students pay online themselves; every payment is logged and the fee
              schedule kept up to date automatically — no manual ledger.
            </p>
          </div>
        </div>

        <section className={s.features}>
          <div className={s.feat}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 4v16" />
            </svg>
            Batches
          </div>
          <div className={s.feat}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h12l4 4v12H4z" />
              <path d="M8 10h8M8 14h8" />
            </svg>
            Notes
          </div>
          <div className={s.feat}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5h6M5 7h14v13H5z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Tests
          </div>
        </section>

        <footer className={s.footer}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v3.8h5.35c-.25 1.4-1.6 4.1-5.35 4.1-3.2 0-5.85-2.65-5.85-5.9S8.8 7.2 12 7.2c1.85 0 3.05.8 3.75 1.45l2.55-2.45C16.7 4.3 14.55 3.4 12 3.4 6.95 3.4 2.85 7.5 2.85 12.6S6.95 21.8 12 21.8c5.5 0 9.15-3.85 9.15-9.3 0-.6-.05-1-.15-1.4z" />
          </svg>
          Every option supports Continue with Google
        </footer>
      </div>
    </div>
  );
}
