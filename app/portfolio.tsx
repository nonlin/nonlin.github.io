"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "work", label: "Selected systems" },
  { id: "agents", label: "Agentic systems" },
  { id: "proof", label: "Proof, not adjectives" },
  { id: "approach", label: "How I work" },
  { id: "path", label: "The path here" },
  { id: "contact", label: "Start a conversation" },
];

const workPlaylistUrl =
  "https://www.youtube.com/watch?v=uxg9X7YQ598&list=PLkH17iOut64HeWTIJMsfctr0DD_tluakG";

const rangeGroups = [
  {
    label: "EXPERIENCE ACROSS",
    items: [
      "Real-time systems",
      "Industrial simulation",
      "Connected products",
      "Agentic tooling",
      "Runtime QA",
    ],
  },
  {
    label: "DELIVERY RANGE",
    items: ["SDK to device", "Prototype to deployment"],
  },
  {
    label: "PLATFORM RANGE",
    items: [
      "Desktop · mobile · edge",
      "Windows · macOS · Linux",
      "iOS · Android",
    ],
  },
];

function RangeSummary() {
  return (
    <div className="range-summary">
      {rangeGroups.map((group) => (
        <section className="range-group" key={group.label}>
          <span className="rail-label">{group.label}</span>
          <div className="range-items">
            {group.items.map((item) => (
              <span className="range-item" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tone: number;
};

function BoidField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Boid[] = [];

    const reset = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.max(36, Math.min(76, Math.floor(width / 13)));
      particles = Array.from({ length: count }, (_, index) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: index % 9 === 0 ? 2.4 : 1.4,
          tone: index % 5,
        };
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const wash = context.createRadialGradient(
        width * 0.72,
        height * 0.34,
        0,
        width * 0.72,
        height * 0.34,
        width * 0.6,
      );
      wash.addColorStop(0, "rgba(148, 113, 255, 0.13)");
      wash.addColorStop(0.45, "rgba(87, 223, 255, 0.04)");
      wash.addColorStop(1, "rgba(12, 12, 19, 0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const boid = particles[index];
        let neighbors = 0;
        let centerX = 0;
        let centerY = 0;
        let alignX = 0;
        let alignY = 0;
        let avoidX = 0;
        let avoidY = 0;

        for (let otherIndex = 0; otherIndex < particles.length; otherIndex += 1) {
          if (index === otherIndex) continue;
          const other = particles[otherIndex];
          const dx = other.x - boid.x;
          const dy = other.y - boid.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < 6800) {
            neighbors += 1;
            centerX += other.x;
            centerY += other.y;
            alignX += other.vx;
            alignY += other.vy;

            if (distanceSquared < 420) {
              avoidX -= dx;
              avoidY -= dy;
            }

            if (otherIndex > index && distanceSquared < 2400) {
              const opacity = Math.max(0, 1 - distanceSquared / 2400) * 0.13;
              context.beginPath();
              context.moveTo(boid.x, boid.y);
              context.lineTo(other.x, other.y);
              context.strokeStyle = `rgba(198, 255, 122, ${opacity})`;
              context.lineWidth = 0.75;
              context.stroke();
            }
          }
        }

        if (!reducedMotion && neighbors > 0) {
          centerX = centerX / neighbors - boid.x;
          centerY = centerY / neighbors - boid.y;
          alignX = alignX / neighbors - boid.vx;
          alignY = alignY / neighbors - boid.vy;
          boid.vx += centerX * 0.00018 + alignX * 0.012 + avoidX * 0.0012;
          boid.vy += centerY * 0.00018 + alignY * 0.012 + avoidY * 0.0012;
        }

        if (!reducedMotion && pointer.active) {
          const dx = boid.x - pointer.x;
          const dy = boid.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 12500 && distanceSquared > 1) {
            const force = (1 - distanceSquared / 12500) * 0.035;
            boid.vx += dx * force;
            boid.vy += dy * force;
          }
        }

        const speed = Math.hypot(boid.vx, boid.vy);
        const limit = 1.45;
        if (speed > limit) {
          boid.vx = (boid.vx / speed) * limit;
          boid.vy = (boid.vy / speed) * limit;
        }

        if (!reducedMotion) {
          boid.x += boid.vx;
          boid.y += boid.vy;
          if (boid.x < -12) boid.x = width + 12;
          if (boid.x > width + 12) boid.x = -12;
          if (boid.y < -12) boid.y = height + 12;
          if (boid.y > height + 12) boid.y = -12;
        }

        const colors = [
          "rgba(198,255,122,0.95)",
          "rgba(173,151,255,0.88)",
          "rgba(95,218,255,0.82)",
          "rgba(255,128,102,0.78)",
          "rgba(231,224,212,0.78)",
        ];
        context.beginPath();
        context.arc(boid.x, boid.y, boid.radius, 0, Math.PI * 2);
        context.fillStyle = colors[boid.tone];
        context.fill();
      }

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    reset();
    draw();
    const observer = new ResizeObserver(() => {
      reset();
      if (reducedMotion) draw();
    });
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="boid-field" aria-hidden="true" />;
}

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("work");
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty(
        "--scroll-progress",
        `${Math.min(Math.max(progress, 0), 1)}`,
      );
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to the work
      </a>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="George Erfesoglou home">
          <span className="wordmark-mark">GE</span>
          <span className="wordmark-copy">
            <strong>George Erfesoglou</strong>
            <small>systems × experiences</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">work</a>
          <a href="#agents">agents</a>
          <a href="#proof">proof</a>
          <a href="#path">path</a>
        </nav>

        <nav className="header-contact" aria-label="Contact links">
          <a
            className="header-social header-playlist"
            href={workPlaylistUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Watch selected work on YouTube"
          >
            Work playlist <span aria-hidden="true">↗</span>
          </a>
          <a
            className="header-social"
            href="https://www.linkedin.com/in/george-erfesoglou-91617a87/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            className="header-social"
            href="https://github.com/nonlin"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a className="header-email" href="mailto:gerfeso@live.com">
            Email me <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <div className="mobile-header-actions">
          <a className="mobile-contact" href="mailto:gerfeso@live.com">
            Email <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "close" : "menu"}</span>
            <span className="menu-glyph" aria-hidden="true">
              {menuOpen ? "×" : "≡"}
            </span>
          </button>
        </div>

        <nav
          className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={closeMenu}>
              <span>0{sections.indexOf(section) + 1}</span>
              {section.label}
            </a>
          ))}
          <div className="mobile-connect-links" aria-label="Social profiles">
            <a
              className="mobile-playlist-link"
              href={workPlaylistUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Watch selected work on YouTube"
            >
              Work playlist <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/george-erfesoglou-91617a87/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/nonlin"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <div className="page-grid">
          <aside className="left-rail" aria-label="On this page">
            <a className="back-to-top" href="#top">
              up to the signal ↑
            </a>
            <nav>
              <p>in this portfolio —</p>
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  className={activeSection === section.id ? "active" : ""}
                  href={`#${section.id}`}
                >
                  <span>0{index + 1}</span>
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="content-column">
            <section className="hero sheet" id="top" aria-labelledby="hero-title">
              <BoidField />
              <div className="hero-noise" aria-hidden="true" />
              <div className="hero-topline">
                <span>FIELD NOTES / 2026</span>
                <span>HOUSTON, TX / 29.76° N</span>
              </div>

              <div className="hero-copy">
                <p className="eyebrow">
                  Director of Software · runtime systems · agentic QA
                </p>
                <h1 id="hero-title">
                  I build the software layer between{" "}
                  <em>strange hardware</em> and believable worlds.
                </h1>
                <p className="hero-deck">
                  I turn prototypes into systems people can actually ship:
                  Unity and Unreal SDKs, industrial simulation, native
                  transports, connected-device tooling, and evidence-driven
                  automation that makes the whole stack more reliable.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href="#work">
                    Enter the work <span aria-hidden="true">↓</span>
                  </a>
                  <ExternalLink
                    className="button button-ghost"
                    href="/george-erfesoglou-resume-2026.pdf"
                  >
                    Read the résumé
                  </ExternalLink>
                </div>
              </div>

              <div className="hero-signal" aria-label="System signal diagram">
                <div className="signal-orbit orbit-one" />
                <div className="signal-orbit orbit-two" />
                <div className="signal-core">
                  <span>runtime</span>
                  <strong>online</strong>
                </div>
                <span className="signal-label signal-label-a">engine</span>
                <span className="signal-label signal-label-b">native</span>
                <span className="signal-label signal-label-c">device</span>
              </div>

              <div className="hero-proof">
                <div>
                  <strong>10+ yrs</strong>
                  <span>shipping real-time software</span>
                </div>
                <div>
                  <strong>4 platforms</strong>
                  <span>one device SDK contract</span>
                </div>
                <div>
                  <strong>Auggie winner</strong>
                  <span>Best in Show VR · 2022</span>
                </div>
              </div>
            </section>

            <aside className="mobile-range" aria-label="At a glance">
              <span className="range-kicker">AT A GLANCE</span>
              <RangeSummary />
            </aside>

            <section className="section" id="work" aria-labelledby="work-title">
              <header className="section-heading">
                <p className="section-index">01 / SELECTED SYSTEMS</p>
                <h2 id="work-title">
                  Shipped past the <em>prototype line.</em>
                </h2>
                <p>
                  My best work lives in the seams: where engine code meets
                  platform APIs, where control logic meets virtual equipment,
                  where a clean editor workflow meets unruly hardware, and
                  where a demo has to survive a real show floor.
                </p>
              </header>

              <article className="case-study scent-case">
                <div className="case-media">
                  <img
                    src="/omara-game.jpg"
                    alt="An Omara scent device mounted above a laptop during a game playtest"
                  />
                  <div className="media-shade" />
                  <span className="media-tag">CONNECTED EXPERIENCE / 01</span>
                  <p className="media-caption">
                    Omara in a scent-enabled game playtest · photo: Champlain
                    College
                  </p>
                </div>
                <div className="case-body">
                  <div className="case-title-row">
                    <span className="case-number">01</span>
                    <div>
                      <p className="eyebrow">OVR · UNITY + UNREAL + NATIVE</p>
                      <h3>A sense nobody had wired into games.</h3>
                    </div>
                  </div>
                  <p className="case-lead">
                    At OVR, I own the engine-to-device path for Omara: the
                    transport layers, SDK contracts, authoring tools, packaging,
                    and lifecycle safety that let a gameplay event become a
                    precise physical scent.
                  </p>

                  <div className="pipeline" aria-label="Engine to device pipeline">
                    <span>gameplay</span>
                    <i aria-hidden="true">→</i>
                    <span>engine SDK</span>
                    <i aria-hidden="true">→</i>
                    <span>BLE / serial</span>
                    <i aria-hidden="true">→</i>
                    <span>device</span>
                  </div>

                  <div className="case-details">
                    <div>
                      <span>SHIPPED ON</span>
                      <strong>Win64 · macOS · Android · iOS</strong>
                    </div>
                    <div>
                      <span>THE HARD PART</span>
                      <strong>
                        One predictable lifecycle across very different native
                        stacks
                      </strong>
                    </div>
                    <div>
                      <span>IN THE WILD</span>
                      <strong>AWE, CES, PAX, partner studios, live demos</strong>
                    </div>
                  </div>

                  <div className="case-links">
                    <ExternalLink href="https://docs.ovrtechnology.com/home/ovr-plugin-unreal">
                      Unreal SDK docs
                    </ExternalLink>
                    <ExternalLink href="https://www.champlain.edu/blog/stories/scent-enabled-games-are-here/">
                      See a playtest
                    </ExternalLink>
                  </div>
                </div>
              </article>

              <article className="case-study boids-case">
                <div className="boids-copy">
                  <div className="case-title-row">
                    <span className="case-number">02</span>
                    <div>
                      <p className="eyebrow">PERSONAL PRODUCT · UNREAL ENGINE</p>
                      <h3>Emergent behavior you can ship.</h3>
                    </div>
                  </div>
                  <p className="case-lead">
                    Physical Boids turns three simple flocking rules into
                    physics-driven swarms that collide with the world instead of
                    ghosting through it. I built it, documented it, and published
                    it as a reusable Unreal plugin.
                  </p>
                  <div className="rating-line">
                    <strong>4.6 / 5</strong>
                    <span>on Fab · 7 ratings</span>
                  </div>
                  <ExternalLink
                    className="text-link"
                    href="https://www.fab.com/listings/2769d493-c45d-40a4-8c8f-0a1fa9dc7b90"
                  >
                    View Physical Boids on Fab
                  </ExternalLink>
                </div>
                <div className="boids-media">
                  <img
                    src="/physical-boids.jpg"
                    alt="A physics-driven flock of glowing black boids inside an Unreal Engine test level"
                  />
                  <div className="boids-legend">
                    <span><i className="dot lime" />cohesion</span>
                    <span><i className="dot purple" />alignment</span>
                    <span><i className="dot coral" />separation</span>
                  </div>
                </div>
              </article>

              <article className="case-study blueprint-case">
                <figure
                  className="commissioning-visual"
                  aria-label="Virtual commissioning sequence from control logic to physical equipment"
                >
                  <figcaption className="commissioning-header">
                    <span>VIRTUAL COMMISSIONING / NOV</span>
                    <strong><i /> MODEL ONLINE</strong>
                  </figcaption>
                  <div className="commissioning-thesis">
                    <span>FIND FAULTS EARLY</span>
                    <strong>
                      Move the risk.
                      <em>Not the steel.</em>
                    </strong>
                  </div>
                  <ol className="commissioning-flow">
                    <li>
                      <span className="flow-index">01</span>
                      <span className="flow-copy">
                        <small>SOURCE</small>
                        <strong>Control logic</strong>
                        <em>PLC commands + interlocks</em>
                      </span>
                      <span className="flow-state">INPUT</span>
                    </li>
                    <li className="flow-active">
                      <span className="flow-index">02</span>
                      <span className="flow-copy">
                        <small>DIGITAL TWIN</small>
                        <strong>Virtual equipment</strong>
                        <em>10+ rig systems in simulation</em>
                      </span>
                      <span className="flow-state">RUN</span>
                    </li>
                    <li>
                      <span className="flow-index">03</span>
                      <span className="flow-copy">
                        <small>VERIFY</small>
                        <strong>Motion + fault tests</strong>
                        <em>Integration issues surface here</em>
                      </span>
                      <span className="flow-state">CHECK</span>
                    </li>
                    <li>
                      <span className="flow-index">04</span>
                      <span className="flow-copy">
                        <small>COMMISSION</small>
                        <strong>Physical equipment</strong>
                        <em>Only after the model passes</em>
                      </span>
                      <span className="flow-state">RELEASE</span>
                    </li>
                  </ol>
                  <div className="commissioning-gate">
                    <span>SIMULATION GATE</span>
                    <strong>PASS <i>✓</i></strong>
                  </div>
                </figure>
                <div className="case-body">
                  <div className="case-title-row">
                    <span className="case-number">03</span>
                    <div>
                      <p className="eyebrow">INDUSTRIAL DIGITAL TWINS · UE4</p>
                      <h3>
                        Before the equipment moved, the software already knew.
                      </h3>
                    </div>
                  </div>
                  <p className="case-lead">
                    At NOV, I built a simulation library of more than ten pieces
                    of drilling equipment so control logic could be exercised
                    before touching real machinery. That changed simulation from
                    a presentation layer into a risk-reduction tool.
                  </p>
                  <div className="impact-note">
                    <span>OUTCOME</span>
                    <strong>Multi-million-dollar commissioning risk avoided</strong>
                    <p>
                      Pre-commissioning tests exposed integration issues while
                      the cost of changing them was still measured in code, not
                      steel and downtime.
                    </p>
                  </div>
                  <div className="case-evidence">
                    <p>
                      External coverage of the wider automation program and its
                      real-world deployment.
                    </p>
                    <ExternalLink
                      className="evidence-link"
                      href="https://www.oedigital.com/news/460903-ensco-launches-continuous-tripping-technology"
                    >
                      <span>RELATED INDUSTRY COVERAGE</span>
                      <strong>Ensco launches Continuous Tripping Technology</strong>
                      <small>OE Digital · Jan 2019</small>
                    </ExternalLink>
                  </div>
                </div>
              </article>

              <div className="lab-notes">
                <div className="lab-intro">
                  <p className="section-index">MORE FROM THE BENCH</p>
                  <h3>Small systems with sharp edges.</h3>
                </div>
                <article className="lab-card">
                  <span className="lab-number">A</span>
                  <p className="eyebrow">NATIVE WINDOWS / C++</p>
                  <h4>A serial core Unity can trust.</h4>
                  <p>
                    Overlapped Win32 I/O, a stable C ABI, explicit timeouts, and
                    safe cancellation—wrapped through P/Invoke for IL2CPP and
                    .NET Standard.
                  </p>
                  <ul>
                    <li>caller-owned buffers</li>
                    <li>bounded shutdown</li>
                    <li>no VC++ runtime dependency</li>
                  </ul>
                </article>
                <article className="lab-card">
                  <span className="lab-number">B</span>
                  <p className="eyebrow">MINECRAFT / FABRIC / WEBSOCKETS</p>
                  <h4>Gameplay events, translated into scent.</h4>
                  <p>
                    A Fabric mod and orchestration bridge that turns game state
                    into timed physical output, visualization, and player-facing
                    feedback.
                  </p>
                  <ul>
                    <li>priority tiers</li>
                    <li>cooldowns + normalization</li>
                    <li>HUD and shader feedback</li>
                  </ul>
                </article>
                <article className="lab-card">
                  <span className="lab-number">C</span>
                  <p className="eyebrow">HONORGG / LINUX / CUDA</p>
                  <h4>Portable input analysis at the edge.</h4>
                  <p>
                    A Raspberry Pi capture pipeline with a compute backend
                    migrated from a Windows D3D11 path to CUDA kernels for
                    portable GPU analysis.
                  </p>
                  <ul>
                    <li>high-rate input capture</li>
                    <li>replayable evidence</li>
                    <li>cross-machine compute</li>
                  </ul>
                </article>
              </div>
            </section>

            <section
              className="section agentic-section"
              id="agents"
              aria-labelledby="agents-title"
            >
              <header className="section-heading">
                <p className="section-index">02 / AGENTIC OUTCOME SYSTEMS</p>
                <h2 id="agents-title">
                  Agents that can act. <em>Evidence that can say no.</em>
                </h2>
                <p>
                  I design agent loops around bounded missions, observable
                  runtime state, and promotion gates—so autonomy produces a
                  reviewable outcome instead of an impressive transcript.
                </p>
              </header>

              <article className="agentic-feature">
                <div
                  className="mission-console"
                  role="img"
                  aria-label="Agentic mission sequence from a bounded contract through delegation, observation, verification, and an evidence-based decision"
                >
                  <div className="console-header">
                    <span>MISSION / OUTCOME-04</span>
                    <strong><i /> EVIDENCE ONLINE</strong>
                  </div>
                  <ol className="mission-path">
                    <li>
                      <span>01</span>
                      <div>
                        <small>CONTRACT</small>
                        <strong>Bound the mission</strong>
                        <p>scope · criteria · required artifacts</p>
                      </div>
                      <em>LOCKED</em>
                    </li>
                    <li>
                      <span>02</span>
                      <div>
                        <small>DELEGATE</small>
                        <strong>Route to the right runtime</strong>
                        <p>local Codex · remote Codex · tools</p>
                      </div>
                      <em>ACTIVE</em>
                    </li>
                    <li>
                      <span>03</span>
                      <div>
                        <small>OBSERVE</small>
                        <strong>Read the actual system</strong>
                        <p>UI state · logs · screenshots · hardware</p>
                      </div>
                      <em>LIVE</em>
                    </li>
                    <li>
                      <span>04</span>
                      <div>
                        <small>VERIFY</small>
                        <strong>Test against the contract</strong>
                        <p>assertions · controls · saved artifacts</p>
                      </div>
                      <em>GATED</em>
                    </li>
                  </ol>
                  <div className="mission-decision">
                    <span>DECISION</span>
                    <div>
                      <strong>CONTINUE</strong>
                      <strong>DONE</strong>
                      <strong>BLOCKED</strong>
                    </div>
                  </div>
                </div>

                <div className="agentic-copy">
                  <div className="scope-tags" aria-label="Project scope">
                    <span>R&amp;D SYSTEM</span>
                    <span>INTERNAL TOOLING</span>
                  </div>
                  <p className="eyebrow">AUTOGEN + CODEX / LOCAL + RASPBERRY PI</p>
                  <h3>A research autopilot with a real stop condition.</h3>
                  <p className="agentic-lead">
                    An AutoGen manager delegates implementation, inspection,
                    testing, and audit work to Codex runtimes across a local
                    workstation and a Raspberry Pi. Every mission carries its
                    own success criteria, evidence requirements, logs, and stop
                    controls.
                  </p>
                  <dl className="agentic-facts">
                    <div>
                      <dt>MISSION CONTRACT</dt>
                      <dd>Prerequisites, bounded scope, artifacts, measurable criteria</dd>
                    </div>
                    <div>
                      <dt>OBSERVATION</dt>
                      <dd>Runtime state, screenshots, logs, and physical input</dd>
                    </div>
                    <div>
                      <dt>OUTCOME</dt>
                      <dd>Explicit continue, done, or blocked—not silent drift</dd>
                    </div>
                  </dl>
                </div>
              </article>

            </section>

            <section className="section" id="proof" aria-labelledby="proof-title">
              <header className="section-heading">
                <p className="section-index">03 / RECEIPTS</p>
                <h2 id="proof-title">
                  Proof, not <em>adjectives.</em>
                </h2>
                <p>
                  The work has made it onto show floors, into engine release
                  notes, onto a marketplace, and through real hardware tests.
                </p>
              </header>

              <div className="proof-grid">
                <ExternalLink
                  className="proof-card proof-featured"
                  href="https://www.awexr.com/usa-2022/auggie-winners"
                >
                  <span className="proof-year">2022</span>
                  <strong>AWE Best in Show VR</strong>
                  <p>
                    Built the scent-enabled VR demo that helped OVR win the
                    show-floor vote.
                  </p>
                  <span className="proof-mark">AUGGIE</span>
                </ExternalLink>
                <ExternalLink
                  className="proof-card"
                  href="https://www.unrealengine.com/blog/unreal-engine-4-21-released?lang=en-US"
                >
                  <span className="proof-year">UE 4.21</span>
                  <strong>Upstream Unreal contributor</strong>
                  <p>
                    Credited by Epic Games among the community contributors to
                    the 4.21 release.
                  </p>
                </ExternalLink>
                <ExternalLink
                  className="proof-card"
                  href={workPlaylistUrl}
                >
                  <span className="proof-year">2026</span>
                  <strong>PAX: scent in real games</strong>
                  <p>
                    Unreal SDK and live hardware demonstrated across a partnered
                    game lineup.
                  </p>
                </ExternalLink>
                <ExternalLink
                  className="proof-card"
                  href="https://www.fab.com/listings/2769d493-c45d-40a4-8c8f-0a1fa9dc7b90"
                >
                  <span className="proof-year">4.6 / 5</span>
                  <strong>A product developers use</strong>
                  <p>
                    Physical Boids remains published and rated on Epic’s Fab
                    marketplace.
                  </p>
                </ExternalLink>
              </div>

              <div className="ai-receipts">
                <div className="ai-receipts-heading">
                  <p className="section-index">AGENTIC RECEIPTS / INTERNAL SYSTEMS</p>
                  <p>Evidence produced by the systems, not adjectives added afterward.</p>
                </div>
                <div className="ai-receipts-grid">
                  <article>
                    <strong>75</strong>
                    <span>automated tests around the local VLM sidecar</span>
                  </article>
                  <article>
                    <strong>UI TREE → ACTION → ASSERTION</strong>
                    <span>runtime QA that can inspect, operate, and verify Unity UI</span>
                  </article>
                  <article>
                    <strong>LOCAL ↔ PI</strong>
                    <span>delegated work across workstation and Raspberry Pi</span>
                  </article>
                  <article>
                    <strong>CONTINUE / DONE / BLOCKED</strong>
                    <span>explicit outcomes and durable stop states</span>
                  </article>
                  <article>
                    <strong>JSON · CSV · MD</strong>
                    <span>reproducible artifacts for review and promotion</span>
                  </article>
                </div>
              </div>
            </section>

            <section
              className="section"
              id="approach"
              aria-labelledby="approach-title"
            >
              <header className="section-heading">
                <p className="section-index">04 / OPERATING PRINCIPLES</p>
                <h2 id="approach-title">
                  I stay with the problem until it becomes{" "}
                  <em>boringly reliable.</em>
                </h2>
              </header>

              <blockquote className="working-quote">
                <span aria-hidden="true">“</span>
                The interesting part is rarely making the happy path work once.
                It is making the whole system understandable when the device
                disappears, the platform behaves differently, or the demo
                starts in five minutes.
              </blockquote>

              <div className="principles">
                <article>
                  <span>01</span>
                  <h3>Cross the boundary.</h3>
                  <p>
                    I do not stop at the engine API. I trace behavior through
                    native platform code, firmware messages, packaging, and the
                    physical device.
                  </p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Design for the next developer.</h3>
                  <p>
                    Clear contracts, useful editor tooling, actionable errors,
                    and documentation turn a clever integration into a platform.
                  </p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Make failure observable.</h3>
                  <p>
                    Request traces, bounded retries, lifecycle state, and
                    hardware-in-the-loop tests make hard bugs reproducible
                    instead of mysterious.
                  </p>
                </article>
              </div>
            </section>

            <section className="section" id="path" aria-labelledby="path-title">
              <header className="section-heading">
                <p className="section-index">05 / THE PATH HERE</p>
                <h2 id="path-title">
                  A decade of building things that{" "}
                  <em>move, react, and connect.</em>
                </h2>
              </header>

              <div className="timeline">
                <article>
                  <time>2021 → now</time>
                  <div>
                    <p className="eyebrow">OVR · DIRECTOR OF SOFTWARE</p>
                    <h3>Connected scent, from native transport to show floor.</h3>
                    <p>
                      Unity and Unreal SDKs, cross-platform BLE and serial,
                      agentic runtime QA, local vision-language systems,
                      authoring tools, release packaging, live demos, and the
                      software ownership required to make a new hardware
                      category usable.
                    </p>
                  </div>
                </article>
                <article>
                  <time>2018 → 2021</time>
                  <div>
                    <p className="eyebrow">NOV · SOFTWARE DEVELOPER</p>
                    <h3>Industrial control logic, tested in a virtual world.</h3>
                    <p>
                      Unreal equipment simulations and Unity training tools that
                      brought expensive commissioning questions forward in time.
                    </p>
                  </div>
                </article>
                <article>
                  <time>2016 → 2017</time>
                  <div>
                    <p className="eyebrow">FUELTECH / FUELFX</p>
                    <h3>AR and VR across desktop and mobile.</h3>
                    <p>
                      Production applications in Unity, Unreal, and Xamarin,
                      shipped through Google Play and the Apple App Store.
                    </p>
                  </div>
                </article>
                <article>
                  <time>2015 → 2016</time>
                  <div>
                    <p className="eyebrow">BEZIER GAMES</p>
                    <h3>A beloved tabletop experience, translated to screens.</h3>
                    <p>
                      Ported the One Night Ultimate Werewolf companion app to
                      PC, Mac, and web with UI, settings, and tightly timed
                      narration.
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <section
              className="section contact-section"
              id="contact"
              aria-labelledby="contact-title"
            >
              <div className="contact-card sheet">
                <div className="contact-photo">
                  <img
                    src="/george-erfesoglou.webp"
                    alt="George Erfesoglou"
                  />
                  <span>GE / HOUSTON</span>
                </div>
                <div className="contact-copy">
                  <p className="section-index">06 / OPEN CHANNEL</p>
                  <h2 id="contact-title">
                    Have a hard problem at the edge of{" "}
                    <em>software and reality?</em>
                  </h2>
                  <p>
                    Those are the conversations I like. Tell me what you are
                    trying to make real.
                  </p>
                  <a className="button button-primary" href="mailto:gerfeso@live.com">
                    gerfeso@live.com <span aria-hidden="true">↗</span>
                  </a>
                  <div className="contact-links">
                    <ExternalLink href="https://github.com/nonlin">
                      GitHub
                    </ExternalLink>
                    <ExternalLink href="https://www.linkedin.com/in/george-erfesoglou-91617a87/">
                      LinkedIn
                    </ExternalLink>
                    <ExternalLink href="/george-erfesoglou-resume-2026.pdf">
                      Résumé
                    </ExternalLink>
                  </div>
                </div>
              </div>
            </section>

            <footer className="site-footer">
              <p>Designed around real work. No buzzword rendering pipeline.</p>
              <p>George Erfesoglou · Houston, Texas · 2026</p>
            </footer>
          </div>

          <aside className="right-rail" aria-label="At a glance">
            <span className="range-kicker">AT A GLANCE</span>
            <RangeSummary />
          </aside>
        </div>
      </main>
    </>
  );
}
