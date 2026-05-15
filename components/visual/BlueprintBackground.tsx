export function BlueprintBackground() {
  return (
    <div className="darquis-blueprint-bg fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 darquis-grid opacity-[0.62]" />
      <svg
        className="darquis-blueprint-field absolute inset-0 h-full w-full text-[var(--darquis-blue)]"
        fill="none"
        viewBox="0 0 1440 980"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="darquis-blueprint-drift">
          <g className="darquis-blueprint-network">
            <path d="M-90 780C180 470 370 630 585 382C780 158 992 220 1530 74" />
            <path d="M-40 820C220 526 424 704 652 430C842 202 1064 254 1484 120" />
            <path d="M118 302C286 166 442 234 594 372C760 522 892 392 1058 234C1210 88 1354 126 1482 42" />
            <path d="M132 914L330 754L516 826L674 632L850 704L1040 514L1292 618" />
            <path d="M986 -70A328 328 0 0 1 1314 258" />
            <path d="M1038 36A218 218 0 0 1 1256 254" />
            <path d="M176 108A286 286 0 0 1 462 394" />
            <path d="M96 790h214M1132 228h242M1090 780h260M348 42v176M1188 0v332M244 682v248" />
          </g>

          <path
            className="darquis-blueprint-trace"
            d="M94 724l142-90l128 64l108-146l152 92l132-166l156 82l118-142"
            stroke="currentColor"
            strokeOpacity="0.24"
            strokeWidth="1.2"
          />
          <path
            className="darquis-blueprint-trace darquis-blueprint-trace-slow"
            d="M988 846l80-118l92 44l64-132l112 74l86-160"
            stroke="currentColor"
            strokeOpacity="0.20"
            strokeWidth="1.2"
          />

          <g className="darquis-blueprint-axis" stroke="currentColor">
            <path d="M0 430h1440M0 620h1440M0 812h1440" />
            <path d="M250 0v980M520 0v980M790 0v980M1060 0v980M1330 0v980" />
          </g>
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(31,166,186,0.10),transparent_24rem),radial-gradient(circle_at_78%_24%,rgba(31,166,186,0.08),transparent_25rem),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.40))]" />
    </div>
  );
}
